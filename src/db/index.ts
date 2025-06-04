import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export default setupDatabase();

function setupDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    return drizzle(postgres());
  }

  const queryClient = postgres(process.env.DATABASE_URL);
  const db = drizzle(queryClient);
  return db;
}
