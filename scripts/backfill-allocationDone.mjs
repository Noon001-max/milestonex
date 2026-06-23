#!/usr/bin/env node
import { Pool } from "pg"

if (!process.env.DATABASE_URL) {
  console.error("Please set DATABASE_URL environment variable and re-run this script.")
  process.exit(1)
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function run() {
  const client = await pool.connect()
  try {
    console.log("Marking allocationDone=true for projects with milestone 1 released...")
    const res = await client.query(
      `UPDATE projects
       SET "allocationDone" = true
       WHERE id IN (
         SELECT "projectId" FROM milestones WHERE "orderIndex" = 0 AND status = 'released'
       )
       RETURNING id;`,
    )
    console.log(`Updated ${res.rowCount} projects.`)
  } catch (err) {
    console.error("Migration failed:", err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

run()
