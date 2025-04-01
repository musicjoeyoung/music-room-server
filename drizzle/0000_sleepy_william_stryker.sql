CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"text_content" text NOT NULL,
	"audio_url" text NOT NULL,
	"image_url" text NOT NULL,
	"video_url" text NOT NULL,
	"prompt_id" serial NOT NULL,
	"user_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prompts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "replies" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" serial NOT NULL,
	"user_id" serial NOT NULL,
	"parent_reply_id" serial NOT NULL,
	"text_content" text NOT NULL,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "upvotes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"post_id" serial NOT NULL,
	"reply_id" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_prompt_completions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"prompt_id" serial NOT NULL,
	"completion_date" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_streaks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"streak_count" serial NOT NULL,
	"last_completed_date" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"display_name" text,
	"avatar" text,
	"bio" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_prompt_id_prompts_id_fk" FOREIGN KEY ("prompt_id") REFERENCES "public"."prompts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "upvotes" ADD CONSTRAINT "upvotes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_prompt_completions" ADD CONSTRAINT "user_prompt_completions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_prompt_completions" ADD CONSTRAINT "user_prompt_completions_prompt_id_prompts_id_fk" FOREIGN KEY ("prompt_id") REFERENCES "public"."prompts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_streaks" ADD CONSTRAINT "user_streaks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;