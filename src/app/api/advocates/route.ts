import { NextRequest } from "next/server";
import db from "../../../db";
import { advocates, PublicAdvocate } from "../../../db/schema";
import { ilike, or, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get("searchTerm");
  let data: PublicAdvocate[] = [];

  if (searchTerm) {
    data = await db
      .select()
      .from(advocates)
      .where(
        or(
          ...[
            advocates.firstName,
            advocates.lastName,
            advocates.city,
            advocates.degree,
            advocates.phoneNumber,
          ].map((col) => ilike(col, `%${searchTerm}%`)),
          // There appears to be a bug in drizzle-kit where
          // jsonb values are being doubly serialized, as is
          // the case with advocates.specialties, the values
          // appear like this.
          //
          // "[\"String 1\", \"String 2\"]"
          // 
          // In order to search in this doubly serialized array,
          // I need to deserialize and then search.
          sql`
            EXISTS (
             SELECT 1 FROM jsonb_array_elements_text((${
               advocates.specialties
             } #>> '{}')::jsonb) AS s
             WHERE s ILIKE ${`%${searchTerm}%`}
           )
          `,
          sql`CAST(${
            advocates.yearsOfExperience
          } AS TEXT) ILIKE ${`%${searchTerm}%`}`
        )
      );
  } else {
    data = await db.select().from(advocates);
  }

  return Response.json({ data });
}
