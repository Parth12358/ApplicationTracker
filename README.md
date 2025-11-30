# 🎯 Job Application Tracker

A modern, privacy-first job application tracker with SimplifyJobs integration. Built with Next.js 16, featuring a beautiful glassmorphism UI and real-time job listings from GitHub's SimplifyJobs repository.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## ✨ Features

- 🔐 **Secure Authentication** - Username/password authentication with BetterAuth
- 💾 **Cloud Database** - Turso (SQLite) cloud database - completely free forever
- 📊 **Real-time Stats** - Track applications by status at a glance
- 🆕 **SimplifyJobs Integration** - Live feed of new grad positions from SimplifyJobs GitHub
- 🎨 **Beautiful UI** - Glassmorphism design with cursor-following animations
- 🚀 **Zero Scroll** - Everything visible on one screen with internal scrolling
- 📱 **Status Management** - Update application status with inline dropdown
- 🔍 **Smart Filtering** - Filter SimplifyJobs by new/all, sort by date/company/title
- 🎓 **International Friendly** - Automatically filters out US citizenship-only jobs
- 💰 **100% Free** - $0/month hosting cost

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.0.5](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Turso](https://turso.tech/) (SQLite cloud database)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [BetterAuth](https://www.better-auth.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: [Vercel](https://vercel.com/) (free tier)

**Total Monthly Cost**: $0.00 💸

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Turso account (free tier)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/job-tracker.git
   cd job-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Turso database**
   ```bash
   # Install Turso CLI
   curl -sSfL https://get.tur.so/install.sh | bash

   # Login to Turso
   turso auth login

   # Create a database
   turso db create job-tracker

   # Get database URL
   turso db show job-tracker --url

   # Create authentication token
   turso db tokens create job-tracker
   ```

4. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   TURSO_DATABASE_URL="libsql://your-database-url.turso.io"
   TURSO_AUTH_TOKEN="eyJhbGc..."
   NEXT_PUBLIC_AUTH_URL="http://localhost:3000"
   NODE_ENV="development"
   ```

5. **Push database schema**
   ```bash
   npm run db:push
   ```

6. **Create your first user**
   ```bash
   npx tsx --env-file=.env.local scripts/simple-create-user.ts <username> <password>
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   
   Navigate to `http://localhost:3000`

## 📖 Usage

### Adding Jobs Manually

1. Click the **"+ Add Job"** button on the dashboard
2. Fill in the job details (company and title are required)
3. Click **"Add Job"** to save

### Importing from SimplifyJobs

1. Browse the **"New Job Opportunities"** section on the right
2. Click **"+ Add to Tracker"** on any job you've applied to
3. The job is automatically added with a timestamp note

### Managing Applications

- **Update Status**: Click the status dropdown on any job card
- **Edit Details**: Click on a job to view details, then click **"Edit"**
- **Delete Application**: Click **"Delete"** on the job detail page

### Filtering SimplifyJobs

- **New Jobs**: Shows only jobs not yet in your tracker
- **All Jobs**: Shows all available positions
- **Sort Options**: Sort by date (newest first), company name (A-Z), or job title (A-Z)

## 📂 Project Structure

```
application-tracker/
├── app/
│   ├── (auth)/
│   │   └── login/              # Login page
│   ├── api/
│   │   ├── auth/               # BetterAuth endpoints
│   │   ├── jobs/               # CRUD operations for jobs
│   │   └── simplify-jobs/      # SimplifyJobs data fetching
│   ├── dashboard/              # Main dashboard
│   ├── jobs/[id]/              # Job detail pages
│   └── layout.tsx              # Root layout
├── components/
│   ├── AddJobButton.tsx        # Add job modal trigger
│   ├── AddJobModal.tsx         # Job creation form
│   ├── DashboardClient.tsx     # Main dashboard UI
│   ├── JobDetailClient.tsx     # Job detail/edit page
│   ├── LogoutButton.tsx        # Logout functionality
│   ├── SimplifyJobsList.tsx    # SimplifyJobs feed
│   └── StatusDropdown.tsx      # Inline status selector
├── lib/
│   ├── auth.ts                 # BetterAuth server config
│   ├── auth-client.ts          # BetterAuth client config
│   └── db/
│       ├── index.ts            # Database connection
│       ├── schema.ts           # Drizzle schema
│       ├── addJob.ts           # Insert operations
│       └── getJobs.ts          # Query operations
├── scripts/
│   └── simple-create-user.ts   # User creation utility
├── middleware.ts               # Route protection
└── drizzle.config.ts           # Drizzle configuration
```

## 🗄️ Database Schema

### Users Table
```typescript
{
  username: string (primary key)
  password: string (bcrypt hashed)
}
```

### Jobs Table
```typescript
{
  id: string (UUID, primary key)
  username: string (foreign key)
  company: string
  jobTitle: string
  jobDescription: string | null
  compensation: string | null
  location: string | null
  applicationUrl: string | null
  status: "applied" | "interviewing" | "offer" | "rejected"
  notes: string | null
  createdAt: Date (applied date)
  updatedAt: Date
}
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Database
npm run db:push      # Push schema to Turso
npm run db:studio    # Open Drizzle Studio

# User Management
npx tsx --env-file=.env.local scripts/simple-create-user.ts <username> <password>

# Build & Deploy
npm run build        # Build for production
npm start            # Start production server
```

## 🎨 Design Philosophy

- **Privacy First**: No signup page, users created manually via script
- **No Scroll Dashboard**: Everything visible at once with internal scrolling
- **Glassmorphism**: Modern frosted glass aesthetic with cursor animations
- **Grayscale Palette**: Clean black/white/gray design
- **Information Dense**: Maximum info with minimal navigation

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `NEXT_PUBLIC_AUTH_URL` (your production URL)
   - `NODE_ENV=production`
4. Deploy!

### Post-Deployment

Create your production user:
```bash
# Update .env.local with production credentials
npx tsx --env-file=.env.local scripts/simple-create-user.ts <username> <password>
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [SimplifyJobs](https://github.com/SimplifyJobs/New-Grad-Positions) for maintaining the job listings
- [Turso](https://turso.tech/) for free SQLite cloud database
- [Vercel](https://vercel.com/) for free hosting
- [BetterAuth](https://www.better-auth.com/) for authentication

## 📧 Support

If you have any questions or run into issues, please open an issue on GitHub.

---

**Built with ❤️ by developers, for developers**

Made to help new grads track their job search journey 🎓