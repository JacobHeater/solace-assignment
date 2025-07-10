import { NextRequest, NextResponse } from "next/server";
import { AdvocateRepository } from "@/db/repositories/advocate/advocate-repository";
import { SortDir } from "@/db/sort/sort-dir";
import { SelectAdvocate } from "@/db/schema";

const advocateRepo = new AdvocateRepository();

export async function GET(req: NextRequest): Promise<NextResponse<{data: any, count?: number}>> {
  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get("searchTerm");

  if (searchTerm) {
    const data = await advocateRepo.textSearchAsync(searchTerm);
    return NextResponse.json({
      data
    });
  }
  if (searchParams.get("sortCol") && searchParams.get("sortDir")) {
    const data = await advocateRepo.findAllAsyncSorted(
      searchParams.get("sortCol") as keyof SelectAdvocate,
      searchParams.get("sortDir") as SortDir
    );
    return Response.json({ data });
  }
  
  const pageNumber = Number(searchParams.get("pageNumber"));
  const pageSize = Number(searchParams.get("pageSize") || 10);

  const {data, count} = await advocateRepo.findAllByPage(pageNumber, pageSize);
  return NextResponse.json({
    data,
    count
  });
}
