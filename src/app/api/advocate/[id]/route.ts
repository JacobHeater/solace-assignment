import { AdvocateRepository } from "@/db/repositories/advocate/advocate-repository";
import { NextRequest } from "next/server";

const advocateRepo = new AdvocateRepository();;

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    throw new ReferenceError("The route param :id is required.");
  }

  if (isNaN(Number(params.id))) {
    throw new Error("The given id must be a number.");
  }

  const advocate = await advocateRepo.findByIdAsync(Number(params.id));

  if (!advocate) {
    return Response.json(null);
  }

  return Response.json(advocate);
}
