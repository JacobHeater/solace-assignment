import { AdvocateRepository } from "@/db/repositories/advocate/advocate-repository";
import { seeder, reset } from "@/db/seed/seeder";

const advocateRepo = new AdvocateRepository();

export async function POST() {
  try {
    await seeder();
    const advocates = await advocateRepo.findAllAsync();

    return Response.json({ advocates });
  } catch (e) {
    console.log(e);
    return Response.error();
  }
}

export async function DELETE() {
  await reset();
  return Response.json({ ok: true });
}
