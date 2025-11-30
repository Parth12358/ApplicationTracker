// app/api/simplify-jobs/route.ts
import { NextResponse } from 'next/server';

interface SimplifyJob {
  company: string;
  jobTitle: string;
  location: string;
  applicationUrl: string;
  datePosted: string;
  isFAANG: boolean;
}

export async function GET() {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/SimplifyJobs/New-Grad-Positions/dev/README.md',
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch SimplifyJobs README');
    }

    const markdown = await response.text();
    const jobs = parseReadmeTable(markdown);

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('SimplifyJobs fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

function parseReadmeTable(markdown: string): SimplifyJob[] {
  const jobs: SimplifyJob[] = [];
  
  // Find the Software Engineering section
  const softwareEngineeringMatch = markdown.match(/## 💻 Software Engineering New Grad Roles(.*?)(?=##|$)/s);
  
  if (!softwareEngineeringMatch) {
    console.error('Could not find Software Engineering section');
    return jobs;
  }
  
  const sectionContent = softwareEngineeringMatch[1];
  
  // Extract table rows between <tr> tags
  const tableMatches = sectionContent.matchAll(/<tr>(.*?)<\/tr>/gs);
  
  let lastCompany = '';
  
  for (const match of tableMatches) {
    const rowHtml = match[1];
    
    // Extract all <td> cells
    const cells: string[] = [];
    const cellMatches = rowHtml.matchAll(/<td[^>]*>(.*?)<\/td>/gs);
    
    for (const cellMatch of cellMatches) {
      cells.push(cellMatch[1].trim());
    }
    
    // Skip header rows or rows with less than 5 columns
    if (cells.length < 5) continue;
    
    const [companyCell, jobTitleCell, locationCell, linksCell, dateCell] = cells;
    
    // Skip if this looks like a header
    if (companyCell.includes('Company') || companyCell.includes('<strong>Company</strong>')) continue;
    
    // Skip if job is closed (🔒)
    if (linksCell.includes('🔒')) continue;
    
    // Skip if requires US citizenship (🇺🇸)
    if (jobTitleCell.includes('🇺🇸') || companyCell.includes('🇺🇸')) continue;
    
    // Skip if doesn't offer sponsorship (🛂)
    if (jobTitleCell.includes('🛂') || companyCell.includes('🛂')) continue;
    
    // Handle continuation rows (↳)
    let company: string;
    if (companyCell === '↳') {
      company = lastCompany;
    } else {
      // Extract company name from HTML
      company = extractText(companyCell);
      lastCompany = company;
    }
    
    // Skip empty companies
    if (!company) continue;
    
    const jobTitle = extractText(jobTitleCell);
    const location = extractText(locationCell).replace(/<\/br>/g, ', ');
    const applicationUrl = extractFirstLink(linksCell);
    const datePosted = extractText(dateCell);
    
    const isFAANG = companyCell.includes('🔥');
    
    jobs.push({
      company,
      jobTitle,
      location,
      applicationUrl,
      datePosted,
      isFAANG,
    });
  }
  
  return jobs;
}

function extractText(html: string): string {
  // Remove all HTML tags
  let text = html.replace(/<[^>]+>/g, '');
  // Decode HTML entities
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#x27;/g, "'");
  // Remove extra whitespace
  text = text.trim();
  return text;
}

function extractFirstLink(html: string): string {
  const linkMatch = html.match(/href="([^"]+)"/);
  return linkMatch ? linkMatch[1] : '';
}