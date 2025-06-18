import { NextRequest } from "next/server";
import { AdvocateRepository } from "@/db/repositories/advocate/advocate-repository";
import { SortDir } from "@/db/sort/sort-dir";
import { SelectAdvocate } from "@/db/schema";

const advocateRepo = new AdvocateRepository();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get("searchTerm");

  if (searchTerm) {
    const data = await advocateRepo.textSearchAsync(searchTerm);
    return Response.json({ data });
  }

  if (searchParams.get("sortCol") && searchParams.get("sortDir")) {
    const data = await advocateRepo.findAllAsyncSorted(
      searchParams.get("sortCol") as keyof SelectAdvocate,
      searchParams.get("sortDir") as SortDir
    );
    return Response.json({ data });
  }

  const data = await advocateRepo.findAllAsync();
  return Response.json({ data });
}
