import { analysis, jobDescriptions, resumes, users } from "./schema"

export type InsertUser = typeof users.$inferInsert
export type SelectUser = typeof users.$inferSelect
export type InsertResume = typeof resumes.$inferInsert
export type SelectResume = typeof resumes.$inferSelect
export type InsertJobDescription = typeof jobDescriptions.$inferInsert
export type SelectJobDescription = typeof jobDescriptions.$inferSelect
export type InsertAnalysis = typeof analysis.$inferInsert
export type SelectAnalysis = typeof analysis.$inferSelect
