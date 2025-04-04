CREATE TABLE "models" (
	"id" varchar PRIMARY KEY NOT NULL,
	"architecture" varchar,
	"author" varchar,
	"date" timestamp,
	"class" varchar,
	"compat_class" varchar,
	"description" varchar,
	"hash_sha256" varchar,
	"license" varchar,
	"is_negative_embedding" boolean,
	"is_supported_model_format" boolean,
	"loaded" boolean,
	"local" boolean,
	"merged_from" varchar,
	"name" varchar,
	"preview_image" varchar,
	"standard_height" integer,
	"standard_width" integer,
	"tags" varchar[],
	"title" varchar,
	"trigger_phrase" varchar,
	"type" varchar,
	"hash" varchar,
	"time_created" timestamp,
	"time_modified" timestamp,
	"usage_hint" varchar
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"tag" varchar PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags_to_models" (
	"model_id" varchar,
	"tag" varchar
);
--> statement-breakpoint
ALTER TABLE "tags_to_models" ADD CONSTRAINT "tags_to_models_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tags_to_models" ADD CONSTRAINT "tags_to_models_tag_tags_tag_fk" FOREIGN KEY ("tag") REFERENCES "public"."tags"("tag") ON DELETE no action ON UPDATE no action;