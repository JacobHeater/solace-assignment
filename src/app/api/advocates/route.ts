import { NextRequest, NextResponse } from "next/server";
import { AdvocateRepository } from "@/db/repositories/advocate/advocate-repository";

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

  const pageNumber = Number(searchParams.get("pageNumber"));
  const pageSize = Number(searchParams.get("pageSize") || 10);

  const {data, count} = await advocateRepo.findAllByPage(pageNumber, pageSize);
  return NextResponse.json({
    data,
    count
  });
}
