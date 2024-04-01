CREATE TABLE IF NOT EXISTS "accesses" (
	"id" serial PRIMARY KEY NOT NULL,
	"login" varchar(128) NOT NULL,
	"password" varchar(64) NOT NULL
);
