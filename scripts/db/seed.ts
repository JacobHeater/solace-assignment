import { reset, seeder } from '@/db/seed/seeder';
import { keyInYN } from 'readline-sync';

(async function seedAdvocates() {
  try {
    const clearExisting = keyInYN("Do you want to clear existing advocates and other associated data before seeding? ");
    if (clearExisting) {
      await reset();
      console.log("Cleared existing advocates and associated data.");
    } else {
      console.log("Skipping clearing existing advocates.");
    }

    await seeder();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding advocates:", error);
    process.exit(1);
  }
})();