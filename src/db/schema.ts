import { sql } from "drizzle-orm";
import {
  pgTable,
  integer,
  text,
  serial,
  timestamp,
  unique,
  primaryKey} from "drizzle-orm/pg-core";

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

export const tagTypes = pgTable(
  "tag_types",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    uniqueTitle: unique().on(table.title).nullsNotDistinct(),
  })
);

export const tags = pgTable(
  "tags",
  {
    id: serial("id").primaryKey(),
    tagTypeId: integer("tag_type_id")
      .notNull()
      .references(() => tagTypes.id),
    title: text("title").notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`)
  },
  (table) => ({
    uniqueTitle: unique().on(table.title).nullsNotDistinct()
  })
);

export const advocateTags = pgTable(
  "advocate_tags",
  {
    advocateId: integer("advocate_id")
      .notNull()
      .references(() => advocates.id),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.advocateId, table.tagId],
    }),
  })
);

export type SelectAdvocate = typeof advocates.$inferSelect;
export type Tags = typeof tags.$inferSelect;
export type InsertTags = typeof tags.$inferInsert;
export type TagTypes = typeof tagTypes.$inferSelect;
export type InsertTagTypes = typeof tagTypes.$inferInsert;
export type AdvocateTags = typeof advocateTags.$inferSelect;
export type InsertAdvocateTags = typeof advocateTags.$inferInsert;
export type InsertAdvocate = typeof advocates.$inferInsert;
export type GeneratedAdvocate = Omit<SelectAdvocate, "id" | "createdAt">;
export type PublicAdvocate = Omit<SelectAdvocate, "id">;
