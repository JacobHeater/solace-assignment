import { generateRandomNumber } from "@/app/helpers/random-number";
import { randomSpecialties } from "./specialties";
import { GeneratedAdvocate } from "../schema";

export const advocateData: GeneratedAdvocate[] = Array.from({ length: 15 }, generateRandomAdvocate);

function generateRandomAdvocate(): GeneratedAdvocate {
  return {
    firstName: generateRandomFirstName(),
    lastName: generateRandomLastName(),
    city: generateRandomCity(),
    degree: generateRandomDegree(),
    specialties: randomSpecialties(2),
    yearsOfExperience: generateRandomNumber(1, 20),
    phoneNumber: generateRandomPhoneNumber(),
  };
}

function generateRandomFirstName(): string {
  const firstNames = ["John", "Jane", "Alice", "Michael", "Emily", "Chris", "Jessica", "David", "Laura", "Daniel", "Sarah", "James", "Megan", "Joshua", "Amanda"];
  return getRandomElement(firstNames);
}

function generateRandomLastName(): string {
  const lastNames = ["Doe", "Smith", "Johnson", "Brown", "Davis", "Martinez", "Taylor", "Harris", "Clark", "Lewis", "Lee", "King", "Green", "Walker", "Hall"];
  return getRandomElement(lastNames);
}

function generateRandomCity(): string {
  const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"];
  return getRandomElement(cities);
}

function generateRandomDegree(): string {
  const degrees = ["MD", "PhD", "MSW"];
  return getRandomElement(degrees);
}

function generateRandomPhoneNumber(): string {
  const areaCode = generateRandomNumber(100, 999);
  const centralOfficeCode = generateRandomNumber(100, 999);
  const lineNumber = generateRandomNumber(1000, 9999);
  return `+1-${areaCode}-${centralOfficeCode}-${lineNumber}`;
}

function getRandomElement<T>(items: T[]): T {
  return items[generateRandomNumber(0, items.length - 1)];
}
