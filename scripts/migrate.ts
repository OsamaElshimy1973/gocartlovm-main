import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY // Note: Use service role key for migrations

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runMigration() {
  try {
    console.log('Starting migration...')

  // Resolve __dirname for ESM
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  // Read all migration files from migrations folder and run them in filename order
  const migrationsDir = path.join(__dirname, '../supabase/migrations')
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort()

  for (const file of files) {
    console.log(`Applying migration: ${file}`)
    const migrationSQL = fs.readFileSync(path.join(migrationsDir, file), 'utf8')

    // Split the migration into individual statements safely (respecting quotes and dollar-quoted blocks)
    const statements = splitSqlStatements(migrationSQL)

    // Execute each statement; ignore benign "already exists" errors
    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc('exec_sql', {
          sql_string: statement + ';'
        })

        if (error) {
          // Common codes:
          // 42P07: duplicate_table
          // 42710: duplicate_object (e.g., type exists)
          // 42701: duplicate_column
          // PGRST202: function not found
          const code = (error && (error as any).code) || null
          if (code === '42P07' || code === '42710' || code === '42701' || code === '23505' || code === '42501') {
            // 42501: permission denied (e.g., cannot create extension) - skip on hosted DB where not allowed
            console.log(`Skipping statement because object already exists or not permitted (code=${code}).`)
            continue
          }
          console.error('Error executing statement:', error)
          console.error('Failed statement:', statement)
          throw error
        }
      } catch (err: any) {
        console.error('Error executing statement (exception):', err && err.message ? err.message : err)
        throw err
      }
    }
  }

    console.log('Migration completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

function splitSqlStatements(sql: string): string[] {
  const statements: string[] = []
  let cur = ''
  let i = 0
  const len = sql.length

  while (i < len) {
    const ch = sql[i]

    // Line comment --...
    if (ch === '-' && sql[i + 1] === '-') {
      // consume until newline
      const nextNewline = sql.indexOf('\n', i + 2)
      if (nextNewline === -1) {
        cur += sql.slice(i)
        break
      } else {
        cur += sql.slice(i, nextNewline + 1)
        i = nextNewline + 1
        continue
      }
    }

    // Block comment /* ... */
    if (ch === '/' && sql[i + 1] === '*') {
      const end = sql.indexOf('*/', i + 2)
      if (end === -1) {
        cur += sql.slice(i)
        break
      } else {
        cur += sql.slice(i, end + 2)
        i = end + 2
        continue
      }
    }

    // Single-quoted string
    if (ch === "'") {
      cur += ch
      i++
      while (i < len) {
        const c2 = sql[i]
        cur += c2
        if (c2 === "'") {
          // handle escaped single quote ''
          if (sql[i + 1] === "'") {
            cur += "'"
            i += 2
            continue
          }
          i++
          break
        }
        i++
      }
      continue
    }

    // Double-quoted identifier
    if (ch === '"') {
      cur += ch
      i++
      while (i < len) {
        const c2 = sql[i]
        cur += c2
        if (c2 === '"') {
          i++
          break
        }
        i++
      }
      continue
    }

    // Dollar-quoted string: $tag$ ... $tag$
    if (ch === '$') {
      // capture tag
      const tagMatch = sql.slice(i).match(/^\$[A-Za-z0-9_]*\$/)
      if (tagMatch) {
        const tag = tagMatch[0]
        const endIdx = sql.indexOf(tag, i + tag.length)
        if (endIdx === -1) {
          // unterminated, append rest
          cur += sql.slice(i)
          break
        }
        // include the whole dollar quoted block
        cur += sql.slice(i, endIdx + tag.length)
        i = endIdx + tag.length
        continue
      }
    }

    // Statement delimiter
    if (ch === ';') {
      const trimmed = cur.trim()
      if (trimmed.length > 0) statements.push(trimmed)
      cur = ''
      i++
      continue
    }

    // default
    cur += ch
    i++
  }

  const last = cur.trim()
  if (last.length > 0) statements.push(last)
  return statements
}

// Run the migration
runMigration()