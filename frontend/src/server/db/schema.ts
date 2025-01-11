import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// user 1 --- * resumes
// user 1 --- * job_descriptions
// resume 1 --- 1 analysis

const timestamps = {
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}

export const users = pgTable("users", {
    id: uuid().defaultRandom().primaryKey(),
    clerkId: varchar("clerk_id").notNull().unique(),
})

export const usersRelations = relations(users, ({ many }) => ({
    usersToResumes: many(resumes),
    usersToJobDescriptions: many(jobDescriptions),
}))

export const resumes = pgTable("resumes", {
    id: uuid().defaultRandom().primaryKey(),
    fileName: varchar("file_name").notNull(),
    fileUploadUrl: varchar("file_upload_url").notNull(), // bucket url
    clerkUserId: varchar("clerk_user_id").notNull(),
    ...timestamps,
})

export const resumesRelations = relations(resumes, ({ one }) => ({
    uploader: one(users, { fields: [resumes.clerkUserId], references: [users.clerkId] }),
    analysis: one(analysis),
}))

export const jobDescriptions = pgTable("job_descriptions", {
    id: uuid().defaultRandom().primaryKey(),
    content: varchar(),
    clerkUserId: varchar("clerk_user_id").notNull(),
    ...timestamps,
})

export const jobDescriptionsRelations = relations(jobDescriptions, ({ one }) => ({
    uploader: one(users, {
        fields: [jobDescriptions.clerkUserId],
        references: [users.clerkId],
    }),
}))

export const analysis = pgTable("analysis", {
    id: uuid().defaultRandom().primaryKey(),
    content: varchar().notNull(),
    ...timestamps,
    resumeId: uuid("resume_id").notNull(),
})

export const analysisRelations = relations(analysis, ({ one }) => ({
    resume: one(resumes, { fields: [analysis.resumeId], references: [resumes.id] }),
}))
