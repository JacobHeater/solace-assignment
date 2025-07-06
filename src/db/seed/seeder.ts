import db from "..";
import {
  tags,
  advocates,
  EntityTags,
  entityTags,
  tagTypes,
  entities,
  SelectAdvocate,
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

  const advocateRecords: SelectAdvocate[] = [];
  for (const advocate of advocateRecords) {
    const [entity] = await db
      .insert(entities)
      .values({})
      .returning();
    const [advocateRecord] = await db
      .insert(advocates)
      .values(advocate)
      .returning();
    advocateRecords.push(advocateRecord);
  }

  for (const adv of advocateData) {
    const advocateSpecialtiesEntries: EntityTags[] = randomSpecialties(
      2,
      specialtiesTagsRecords
    ).map((tag) => ({
      entityId: adv.entityId,
      tagId: tag.id!,
      createdAt: null
    }));

    await db
      .insert(entityTags)
      .values(advocateSpecialtiesEntries)
      .returning();
  }

  console.log(`Seeded ${advocateRecords.length} advocates.`);
  console.log(`Seeded ${specialtiesTagsRecords.length} specialties.`);
  console.log(`Seeded advocate specialties.`);
}

export async function reset() {
  await db.delete(entityTags);
  await db.delete(advocates);
  await db.delete(tags);
}
