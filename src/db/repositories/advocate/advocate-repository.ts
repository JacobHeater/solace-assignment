import { IAdvocate } from "@/app/types/advocate";
import db from "@/db";
import {
  advocates,
  AdvocateSpecialties,
  advocateSpecialties,
  SelectAdvocate,
  Specialties,
  specialties,
} from "@/db/schema";
import { asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { IRepository } from "@/db/repositories/repository";
import { SortDir } from "@/db/sort/sort-dir";

type AmalgamatedType = {
  advocates: SelectAdvocate;
  advocate_specialties: AdvocateSpecialties | null;
  specialties: Specialties | null;
};

export class AdvocateRepository implements IRepository<IAdvocate> {
  async findAllAsync(): Promise<IAdvocate[]> {
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

  async findByIdAsync(id: number): Promise<IAdvocate> {
    const data = await db
      .select()
      .from(advocates)
      .innerJoin(
        advocateSpecialties,
        eq(advocateSpecialties.advocateId, advocates.id)
      )
      .innerJoin(
        specialties,
        eq(specialties.id, advocateSpecialties.specialtyId)
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
          advocateSpecialties,
          eq(advocateSpecialties.advocateId, advocates.id)
        )
        .innerJoin(
          specialties,
          eq(advocateSpecialties.specialtyId, specialties.id)
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
            ilike(specialties.title, `%${term}%`),
            ilike(specialties.description, `%${term}%`),
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
          specialties: [],
        });
      }

      if (row.specialties && row.advocate_specialties) {
        advocateMap.get(advocateId)?.specialties.push({
          createdAt: row.advocate_specialties.createdAt,
          description: row.specialties.description,
          title: row.specialties.title,
          id: row.advocate_specialties.id,
        });
      }
    }

    return Array.from(advocateMap.values());
  }
}
