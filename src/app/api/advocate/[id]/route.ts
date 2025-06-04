import db from "@/db";
import { advocates } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    throw new ReferenceError('The route param :id is required.')
  }

  if (isNaN(Number(params.id))) {
    throw new Error('The given id must be a number.')
  }

  const [advocate] = await db
    .select()
    .from(advocates)
    .where(eq(advocates.id, Number(params.id)));

  if (!advocate) {
    return Response.json(null);
  }

  return Response.json(advocate);
}
