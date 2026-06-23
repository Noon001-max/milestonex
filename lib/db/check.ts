import { pool } from "./index"

export async function isDbAvailable(timeoutMs = 2000): Promise<boolean> {
  try {
    const client = await pool.connect()
    try {
      // lightweight probe
      await client.query('SELECT 1')
      return true
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('DB availability check failed:', err)
    return false
  }
}
