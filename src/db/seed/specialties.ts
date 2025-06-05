import { generateRandomNumber } from "@/app/helpers/random-number";
import type { Specialties } from "../schema";

export const specialtiesData: Specialties[] = [
  "Bipolar",
  "LGBTQ",
  "Medication/Prescribing",
  "Suicide History/Attempts",
  "General Mental Health (anxiety, depression, stress, grief, life transitions)",
  "Men's issues",
  "Relationship Issues (family, friends, couple, etc)",
  "Trauma & PTSD",
  "Personality disorders",
  "Personal growth",
  "Substance use/abuse",
  "Pediatrics",
  "Women's issues (post-partum, infertility, family planning)",
  "Chronic pain",
  "Weight loss & nutrition",
  "Eating disorders",
  "Diabetic Diet and nutrition",
  "Coaching (leadership, career, academic and wellness)",
  "Life coaching",
  "Obsessive-compulsive disorders",
  "Neuropsychological evaluations & testing (ADHD testing)",
  "Attention and Hyperactivity (ADHD)",
  "Sleep issues",
  "Schizophrenia and psychotic disorders",
  "Learning disorders",
  "Domestic abuse",
].map((sp) => ({
  description: '',
  title: sp
}));

export function randomSpecialties(length: number, specialties: Specialties[]): Specialties[] {
  const distinctSpecialties = new Set<Specialties>();

  while (distinctSpecialties.size < length) {
    const randomIndex = generateRandomNumber(0, specialties.length - 1);
    distinctSpecialties.add(specialties[randomIndex]);
  }

  return Array.from(distinctSpecialties);
}
