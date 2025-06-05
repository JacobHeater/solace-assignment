import db from "..";
import {
  specialties,
  advocates,
  AdvocateSpecialties,
  advocateSpecialties,
} from "../schema";
import { advocateData } from "./advocates";
import { specialtiesData, randomSpecialties } from "./specialties";

export async function seeder() {
  const specialtiesRecords = await db
    .insert(specialties)
    .values(specialtiesData)
    .returning();
  const advocateRecords = await db
    .insert(advocates)
    .values(advocateData)
    .returning();

  for (const adv of advocateRecords) {
    const advocateSpecialtiesEntries: AdvocateSpecialties[] = randomSpecialties(
      2,
      specialtiesRecords
    ).map((spec) => ({
      advocateId: adv.id,
      specialtyId: spec.id!,
    }));

    await db
      .insert(advocateSpecialties)
      .values(advocateSpecialtiesEntries)
      .returning();
  }

  console.log(`Seeded ${advocateRecords.length} advocates.`);
  console.log(`Seeded ${specialtiesRecords.length} specialties.`);
  console.log(`Seeded advocate specialties.`);
}

export async function reset() {
  await db.delete(advocateSpecialties);
  await db.delete(advocates);
  await db.delete(specialties);
}
