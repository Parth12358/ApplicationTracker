import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

// Users table - for authentication
export const users = sqliteTable('users', {
  username: text('username').notNull().unique().primaryKey(),
  password: text('password').notNull(),
})

// Jobs table - for tracking applications
export const jobs = sqliteTable('jobs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  username: text('username').notNull().references(() => users.username, { onDelete: 'cascade' }),
  
  // Job details
  company: text('company').notNull(),
  jobTitle: text('job_title').notNull(),
  jobDescription: text('job_description'),
  compensation: text('compensation'),
  location: text('location'),
  applicationUrl: text('application_url'),
  
  // Tracking
  status: text('status').notNull().default('applied'), // applied, interviewing, offer, rejected
  notes: text('notes'),
  
  // Timestamps (createdAt = applied date)
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

// TypeScript types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Job = typeof jobs.$inferSelect
export type NewJob = typeof jobs.$inferInsert