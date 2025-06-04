import db from "@/db";
import { advocates } from "@/db/schema";
import { advocateData } from "@/db/seed/advocates";
import { keyInYN } from 'readline-sync';

(async function seedAdvocates() {
  try {
    const clearExisting = keyInYN("Do you want to clear existing advocates before seeding? ");
    if (clearExisting) {
      await db.delete(advocates);
      console.log("Cleared existing advocates.");
    } else {
      console.log("Skipping clearing existing advocates.");
    }
    const records = await db.insert(advocates).values(advocateData).returning();

    console.log(`Seeded ${records.length} advocates.`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding advocates:", error);
    process.exit(1);
  }
})();