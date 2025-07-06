import { IAdvocate } from "@/app/types/advocate";
import db from "@/db";
import {
  advocates,
  AdvocateTags,
  advocateTags,
  SelectAdvocate,
  Tags,
  tags,
  TagTypes,
  tagTypes,
} from "@/db/schema";
import { eq, ilike, or, sql, } from "drizzle-orm";
import { IRepository } from "@/db/repositories/repository";
import { TagType } from "@/app/types/tag";

type AmalgamatedType = {
  advocates: SelectAdvocate;
  advocate_tags: AdvocateTags | null; 
  tags: Tags | null;
  tag_types: TagTypes | null;
};

export class AdvocateRepository implements IRepository<IAdvocate> {
  async findAllAsync(): Promise<IAdvocate[]> {
    const data = await db
      .select()
      .from(advocates)
      .leftJoin(
        advocateTags,
        eq(advocateTags.advocateId, advocates.id)
      )
      .leftJoin(
        tags,
        eq(tags.id, advocateTags.tagId)
      )
      .leftJoin(
        tagTypes,
        eq(tagTypes.id, tags.tagTypeId)
      );

    return this.amalgamateJoinedRowsToIAdvocate(data);
  }

  async findByIdAsync(id: number): Promise<IAdvocate> {
    const data = await db
      .select()
      .from(advocates)
      .innerJoin(
        advocateTags,
        eq(advocateTags.advocateId, advocates.id)
      )
      .innerJoin(
        tags,
        eq(tags.id, advocateTags.tagId)
      )
      .innerJoin(
        tagTypes,
        eq(tagTypes.id, tags.tagTypeId)
      )
      .where(eq(advocates.id, id));

    const [advocate] = this.amalgamateJoinedRowsToIAdvocate(data)

    return advocate;
  }

  async textSearchAsync(term: string): Promise<IAdvocate[]> {
    if (term) {
      const data = await db
        .select()
        .from(advocates)
        .innerJoin(
          advocateTags,
          eq(advocateTags.advocateId, advocates.id)
        )
        .innerJoin(
          tags,
          eq(tags.id, advocateTags.tagId)
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

      if (row.advocate_tags && row.tags && row.tag_types) {
        advocateMap.get(advocateId)?.tags.push({
          createdAt: row.advocate_tags.createdAt,
          description: row.tags.description,
          title: row.tags.title,
          tagType: row.tag_types.title as TagType
        });
      }
    }

    return Array.from(advocateMap.values());
  }
}
