/*
  Warnings:

  - Added the required column `company_id` to the `emails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "company"."emails" ADD COLUMN     "company_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "company"."emails" ADD CONSTRAINT "emails_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
