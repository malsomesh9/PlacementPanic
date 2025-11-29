import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  college: text("college"),
  year: text("year"),
  targetRole: text("target_role"),
});

export const questions = pgTable("questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  text: text("text").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
});

export const interviews = pgTable("interviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  duration: integer("duration").notNull(),
  questionsAnswered: integer("questions_answered").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  averageRating: integer("average_rating").notNull(),
  ratings: jsonb("ratings").$type<number[]>().notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertQuestionSchema = createInsertSchema(questions).omit({ id: true });
export const insertInterviewSchema = createInsertSchema(interviews).omit({ id: true, completedAt: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;
export type InsertInterview = z.infer<typeof insertInterviewSchema>;
export type Interview = typeof interviews.$inferSelect;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  college: z.string().optional(),
  year: z.string().optional(),
  targetRole: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;

export const CATEGORIES = ["DSA", "Web Development", "Java", "System Design", "HR"] as const;
export const DIFFICULTIES = ["easy", "medium", "hard"] as const;
export const DURATIONS = [5, 10, 15] as const;

export type Category = typeof CATEGORIES[number];
export type Difficulty = typeof DIFFICULTIES[number];
export type Duration = typeof DURATIONS[number];

export interface UserStats {
  totalInterviews: number;
  averageScore: number;
  bestScore: number;
  panicReductionIndex: number;
  recentSessions: Interview[];
  categoryBreakdown: Record<string, number>;
  difficultyBreakdown: Record<string, number>;
  scoreHistory: { date: string; score: number }[];
}

export interface Feedback {
  overallMessage: string;
  strengths: string[];
  improvements: string[];
  tips: string[];
}

export interface InterviewSession {
  category: Category;
  difficulty: Difficulty;
  duration: Duration;
  questions: Question[];
  currentQuestionIndex: number;
  ratings: number[];
  startTime: number;
  isComplete: boolean;
}

// Answers table for storing user responses to interview questions
export const answers = pgTable("answers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  interviewId: varchar("interview_id").notNull(),
  questionId: varchar("question_id").notNull(),
  userId: varchar("user_id").notNull(),
  answerText: text("answer_text").notNull(),
  confidence: integer("confidence"), // 1-5 scale
  feedback: text("feedback"), // AI-generated feedback
  score: integer("score"), // 0-100 scale
  evaluationStatus: text("evaluation_status").default("pending"), // pending, completed, error
  submittedAt: timestamp("submitted_at").defaultNow(),
  evaluatedAt: timestamp("evaluated_at"),
});

export const insertAnswerSchema = createInsertSchema(answers).omit({ id: true, submittedAt: true, evaluatedAt: true });
export type InsertAnswer = z.infer<typeof insertAnswerSchema>;
export type Answer = typeof answers.$inferSelect;

// Real-time answer evaluation request/response types
export const submitAnswerSchema = z.object({
  interviewId: z.string().uuid(),
  questionId: z.string().uuid(),
  answerText: z.string().min(1, "Answer cannot be empty"),
  confidence: z.number().int().min(1).max(5).optional(),
});

export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;

export interface AnswerEvaluation {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  evaluationTime: number;
}

export interface RealTimeAnswerUpdate {
  status: "evaluating" | "completed" | "error";
  answerId: string;
  progress?: number; // 0-100 for streaming evaluation
  evaluation?: AnswerEvaluation;
  error?: string;
}
