/*
  Warnings:

  - You are about to drop the `company_tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "company"."company_tags" DROP CONSTRAINT "company_tags_company_id_fkey";

-- DropForeignKey
ALTER TABLE "company"."company_tags" DROP CONSTRAINT "company_tags_tag_id_fkey";

-- DropTable
DROP TABLE "company"."company_tags";

-- DropTable
DROP TABLE "company"."tags";

-- CreateTable
CREATE TABLE "company"."skills" (
    "id" SERIAL NOT NULL,
    "skill" TEXT NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company"."company_skills" (
    "company_id" INTEGER NOT NULL,
    "skill_id" INTEGER NOT NULL,

    CONSTRAINT "company_skills_pkey" PRIMARY KEY ("company_id","skill_id")
);

-- CreateTable
CREATE TABLE "company"."roles" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company"."company_roles" (
    "company_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "company_roles_pkey" PRIMARY KEY ("company_id","role_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "skills_skill_key" ON "company"."skills"("skill");

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_key" ON "company"."roles"("role");

-- AddForeignKey
ALTER TABLE "company"."company_skills" ADD CONSTRAINT "company_skills_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company"."company_skills" ADD CONSTRAINT "company_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "company"."skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company"."company_roles" ADD CONSTRAINT "company_roles_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company"."company_roles" ADD CONSTRAINT "company_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "company"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
