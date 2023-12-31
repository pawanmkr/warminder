/*
  Warnings:

  - Made the column `size` on table `companies` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "company"."companies" ALTER COLUMN "size" SET NOT NULL,
ALTER COLUMN "size" SET DEFAULT 0;
