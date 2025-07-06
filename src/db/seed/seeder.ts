import db from "..";
import {
  tags,
  advocates,
  AdvocateTags,
  advocateTags,
  tagTypes,
} from "../schema";
import { advocateData } from "./advocates";
import { specialtiesTagsData, randomSpecialties, specialtiesTagTypeData } from "./specialties";

export async function seeder() {
  const [specialtiesTagType] = await db
    .insert(tagTypes)
    .values(specialtiesTagTypeData)
    .returning();

  const specialtiesTagsRecords = await db
    .insert(tags)
    .values(specialtiesTagsData.map((record) => ({
      ...record,
      tagTypeId: specialtiesTagType.id
    })))
    .returning();

  const advocateRecords = await db
    .insert(advocates)
    .values(advocateData)
    .returning();

  for (const adv of advocateRecords) {
    const advocateSpecialtiesEntries: AdvocateTags[] = randomSpecialties(
      2,
      specialtiesTagsRecords
    ).map((tag) => ({
      advocateId: adv.id,
      tagId: tag.id!,
      createdAt: null
    }));

    await db
      .insert(advocateTags)
      .values(advocateSpecialtiesEntries)
      .returning();
  }

  console.log(`Seeded ${advocateRecords.length} advocates.`);
  console.log(`Seeded ${specialtiesTagsRecords.length} specialties.`);
  console.log(`Seeded advocate specialties.`);
}

export async function reset() {
  await db.delete(advocateTags);
  await db.delete(advocates);
  await db.delete(tags);
}
