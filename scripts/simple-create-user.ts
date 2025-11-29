import { db } from '../lib/db/index'
import { users } from '../lib/db/schema'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

async function main() {
  const username = process.argv[2]
  const password = process.argv[3]

  if (!username || !password) {
    console.error('❌ Usage: npx tsx scripts/simple-create-user.ts <username> <password>')
    process.exit(1)
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert user
    const user = await db.insert(users).values({
      username,
      password: hashedPassword,
    }).returning()

    console.log('✅ User created successfully!')
    console.log('Username:', user[0].username)
  } catch (error) {
    console.error('❌ Error creating user:', error)
    process.exit(1)
  }
}

main()