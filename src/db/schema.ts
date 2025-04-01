import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export type NewUser = typeof users.$inferInsert;
export type NewPrompt = typeof prompts.$inferInsert;
export type NewPost = typeof posts.$inferInsert;
export type NewReply = typeof replies.$inferInsert;
export type NewUpVote = typeof upVotes.$inferInsert;
export type NewUserStreak = typeof userStreaks.$inferInsert;
export type NewUserPromptCompletion = typeof userPromptCompletions.$inferInsert;


export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  displayName: text("display_name"),
  avatar: text("avatar"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const prompts = pgTable("prompts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  startDate: timestamp("start_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  textContent: text("text_content").notNull(),
  audioUrl: text("audio_url").notNull(),
  imageUrl: text("image_url").notNull(),
  videoUrl: text("video_url").notNull(),
  promptId: serial("prompt_id").notNull().references(() => prompts.id),
  userId: serial("user_id").notNull().references(() => users.id),
});

export const replies = pgTable("replies", {
  id: serial("id").primaryKey(),
  postId: serial("post_id").notNull(),
  userId: serial("user_id").notNull(),
  parentReplyId: serial("parent_reply_id"),
  textContent: text("text_content").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const upVotes = pgTable("upvotes", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").notNull().references(() => users.id),
  postId: serial("post_id").notNull(),
  replyId: serial("reply_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userStreaks = pgTable("user_streaks", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").notNull().references(() => users.id),
  streakCount: serial("streak_count").notNull(),
  lastCompletedDate: timestamp("last_completed_date").notNull()
});

export const userPromptCompletions = pgTable("user_prompt_completions", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").notNull().references(() => users.id),
  promptId: serial("prompt_id").notNull().references(() => prompts.id),
  completionDate: timestamp("completion_date").notNull(),
});