/*
  Warnings:

  - A unique constraint covering the columns `[name,location]` on the table `companies` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "companies_name_location_key" ON "company"."companies"("name", "location");
