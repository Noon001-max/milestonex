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
    // First, add the allocationDone column if it doesn't exist
    const colCheck = await client.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'allocationDone'`,
    )
    if (colCheck.rowCount === 0) {
      console.log("Adding allocationDone column to projects table...")
      await client.query(`ALTER TABLE projects ADD COLUMN "allocationDone" BOOLEAN NOT NULL DEFAULT false`)
    }

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
