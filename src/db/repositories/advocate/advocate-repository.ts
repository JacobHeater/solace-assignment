import { IAdvocate } from "@/app/types/advocate";
import db from "@/db";
import {
  advocates,
  Entities,
  entities,
  EntityTags,
  entityTags,
  SelectAdvocate,
  Tags,
  tags,
  TagTypes,
  tagTypes,
} from "@/db/schema";
import { IRepository } from "@/db/repositories/repository";
import { TagType } from "@/app/types/tag";
import { asc, desc, eq, ilike, or, sql, count } from "drizzle-orm";
import { IRepository } from "@/db/repositories/repository";
import { SortDir } from "@/db/sort/sort-dir";
import { IRepository, PaginatedResult } from "@/db/repositories/repository";

type AmalgamatedType = {
  advocates: SelectAdvocate;
  entities: Entities | null;
  entity_tags: EntityTags | null; 
  tags: Tags | null;
  tag_types: TagTypes | null;
};

export class AdvocateRepository implements IRepository<IAdvocate> {
  async findAllAsync(): Promise<IAdvocate[]> {
    const data = await db
      .select()
      .from(advocates)
      .leftJoin(entities,
        eq(entities.id, advocates.entityId)
      )
      .leftJoin(
        entityTags,
        eq(entityTags.entityId, entities.id)
      )
      .leftJoin(
        tags,
        eq(tags.id, entityTags.tagId)
      )
      .leftJoin(
        tagTypes,
        eq(tagTypes.id, tags.tagTypeId)
      );

    return this.amalgamateJoinedRowsToIAdvocate(data);
  }

  async findAllAsyncSorted(col: keyof SelectAdvocate, dir: SortDir) {
    const drizzleSort = dir === SortDir.ASC ? asc : desc;
    
    const data = await db
      .select()
      .from(advocates)
      .leftJoin(
        advocateSpecialties,
        eq(advocateSpecialties.advocateId, advocates.id)
      )
      .leftJoin(
        specialties,
        eq(advocateSpecialties.specialtyId, specialties.id)
      )
      .orderBy(drizzleSort(advocates[col]));
    
    return this.amalgamateJoinedRowsToIAdvocate(data);
  }

  async findAllByPage(
    pageNumber: number,
    pageSize: number
  ): Promise<PaginatedResult<IAdvocate>> {
    const [totalResult] = await db.select({
      total: count()
    }).from(advocates);

    console.log(pageNumber, pageSize, pageNumber * pageSize);
      .offset(pageNumber * pageSize)
      .limit(pageSize);

    const returnData: IAdvocate[] = [];

    for (const row of data) {
      const advSpecialties = await db
        .select()
        .from(advocateSpecialties)
        .innerJoin(specialties,
          eq(specialties.id, advocateSpecialties.specialtyId)
        )
        .where(eq(advocateSpecialties.advocateId, row.id));

      returnData.push({
        ...row,
        specialties: advSpecialties.map((sp) => ({
          ...sp.specialties
        }))
      });
    }

    return {
      data: returnData,
      count: totalResult.total
    };
  }

  async findByIdAsync(id: number): Promise<IAdvocate> {
    const data = await db
      .select()
      .from(advocates)
      .innerJoin(
        entities,
        eq(entities.id, advocates.entityId)
      )
      .innerJoin(
        entityTags,
        eq(entityTags.entityId, entities.id)
      )
      .innerJoin(
        tags,
        eq(tags.id, entityTags.tagId)
      )
      .innerJoin(
        tagTypes,
        eq(tagTypes.id, tags.tagTypeId)
      )
      .where(eq(advocates.id, id));

    const [advocate] = this.amalgamateJoinedRowsToIAdvocate(data);

    return advocate;
  }

  async textSearchAsync(term: string): Promise<IAdvocate[]> {
    if (term) {
      const data = await db
        .select()
        .from(advocates)
        .innerJoin(
          entities,
          eq(entityTags.entityId, entities.id)
        )
        .innerJoin(
          entityTags,
          eq(entityTags.entityId, advocates.id)
        )
        .innerJoin(
          tags,
          eq(tags.id, entityTags.tagId)
        )
        .innerJoin(
          tagTypes,
          eq(tags.tagTypeId, tagTypes.id)
        )
        .where(
          or(
            ...[
              advocates.firstName,
              advocates.lastName,
              advocates.city,
              advocates.degree,
              advocates.phoneNumber,
            ].map((col) => ilike(col, `%${term}%`)),
            ilike(tags.title, `%${term}%`),
            ilike(tags.description, `%${term}%`),
            sql`CAST(${
              advocates.yearsOfExperience
            } AS TEXT) ILIKE ${`%${term}%`}`
          )
        );
      return this.amalgamateJoinedRowsToIAdvocate(data);
    }
    return [];
  }

  private amalgamateJoinedRowsToIAdvocate(
    rows: AmalgamatedType[]
  ): IAdvocate[] {
    const advocateMap = new Map<number, IAdvocate>();

    for (const row of rows) {
      const advocateId = row.advocates.id;

      if (!advocateMap.has(advocateId)) {
        advocateMap.set(advocateId, {
          ...row.advocates,
          tags: [],
        });
      }

      if (row.entity_tags && row.tags && row.tag_types) {
        advocateMap.get(advocateId)?.tags.push({
          createdAt: row.entity_tags.createdAt,
          description: row.tags.description,
          title: row.tags.title,
          tagType: row.tag_types.title as TagType
        });
      }
    }

    return Array.from(advocateMap.values());
  }
}
