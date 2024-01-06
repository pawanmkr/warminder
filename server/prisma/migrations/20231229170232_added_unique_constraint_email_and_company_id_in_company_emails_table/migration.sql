/*
  Warnings:

  - A unique constraint covering the columns `[email,company_id]` on the table `emails` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "emails_email_company_id_key" ON "company"."emails"("email", "company_id");
