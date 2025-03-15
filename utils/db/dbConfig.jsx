import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Ensure only one instance of db is created
let cachedDb = null;

export function getDb() {
  if (!cachedDb) {
    console.log("Creating new DB connection...");
    const sql = neon(
      "postgresql://zerotohero_owner:SPVe2rokvBf6@ep-bitter-shadow-a5lbwa60.us-east-2.aws.neon.tech/zerotohero?sslmode=require"
    );
    cachedDb = drizzle(sql, { schema });
  }
  return cachedDb;
}

// Export the database connection
export const db = getDb();
