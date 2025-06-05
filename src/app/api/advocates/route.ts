import { NextRequest } from "next/server";
import { AdvocateRepository } from "@/db/repositories/advocate/advocate-repository";

const advocateRepo = new AdvocateRepository();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get("searchTerm");

  if (searchTerm) {
    const data = await advocateRepo.textSearchAsync(searchTerm);
    return Response.json({ data });
  }

  const data = await advocateRepo.findAllAsync();
  return Response.json({ data });
}
