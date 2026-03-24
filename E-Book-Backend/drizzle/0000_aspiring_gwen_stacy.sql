CREATE TABLE "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"image" text NOT NULL,
	"description" text NOT NULL,
	"title" varchar(30) NOT NULL,
	"download" text NOT NULL,
	"reviews" text NOT NULL,
	"author" varchar(30) NOT NULL,
	"genre" varchar(30) NOT NULL
);
