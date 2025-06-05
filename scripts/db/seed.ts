import db from "@/db";
import { advocates, AdvocateSpecialties, advocateSpecialties, specialties } from "@/db/schema";
import { advocateData } from "@/db/seed/advocates";
import { specialtiesData, randomSpecialties } from '@/db/seed/specialties';
import { keyInYN } from 'readline-sync';

(async function seedAdvocates() {
  try {
    const clearExisting = keyInYN("Do you want to clear existing advocates and other associated data before seeding? ");
    if (clearExisting) {
      await db.delete(advocateSpecialties);
      await db.delete(advocates);
      await db.delete(specialties);
      console.log("Cleared existing advocates and associated data.");
    } else {
      console.log("Skipping clearing existing advocates.");
    }

    const specialtiesRecords = await db.insert(specialties).values(specialtiesData).returning();
    const advocateRecords = await db.insert(advocates).values(advocateData).returning();
    
    for (const adv of advocateRecords) {
      const advocateSpecialtiesEntries: AdvocateSpecialties[] = randomSpecialties(2, specialtiesRecords).map((spec) => ({
        advocateId: adv.id,
        specialtyId: spec.id!,
      }));

      await db.insert(advocateSpecialties).values(advocateSpecialtiesEntries).returning();
    }

    console.log(`Seeded ${advocateRecords.length} advocates.`);
    console.log(`Seeded ${specialtiesRecords.length} specialties.`);
    console.log(`Seeded advocate specialties.`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding advocates:", error);
    process.exit(1);
  }
})();