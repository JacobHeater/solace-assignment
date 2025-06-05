import { sql } from "drizzle-orm";
import {
  pgTable,
  integer,
  text,
  serial,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const advocates = pgTable("advocates", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  city: text("city").notNull(),
  degree: text("degree").notNull(),
  yearsOfExperience: integer("years_of_experience").notNull(),
  phoneNumber: text("phone_number").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const specialties = pgTable("specialties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().unique(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`)
});

export const advocateSpecialties = pgTable("advocate_specialties", {
  id: serial("id").primaryKey(),
  advocateId: integer("advocate_id").notNull().references(() => advocates.id),
  specialtyId: integer("specialty_id").notNull().references(() => specialties.id),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`)
}, (table) => ({
  uniqueAdvocateAndSpecialty: unique().on(table.advocateId, table.specialtyId).nullsNotDistinct()
}));

export type SelectAdvocate = typeof advocates.$inferSelect;
export type InsertAdvocate = typeof advocates.$inferInsert;
export type GeneratedAdvocate = Omit<SelectAdvocate, 'id' | 'createdAt'>
export type PublicAdvocate = Omit<SelectAdvocate, 'id'>;

export type Specialties = typeof specialties.$inferInsert;
export type AdvocateSpecialties = typeof advocateSpecialties.$inferInsert;
