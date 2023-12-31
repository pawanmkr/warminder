-- AlterTable
ALTER TABLE "company"."companies" ADD COLUMN     "size" INTEGER,
ADD COLUMN     "website" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "company"."tags" (
    "id" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company"."company_tags" (
    "company_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "company_tags_pkey" PRIMARY KEY ("company_id","tag_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tags_tag_key" ON "company"."tags"("tag");

-- AddForeignKey
ALTER TABLE "company"."company_tags" ADD CONSTRAINT "company_tags_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"."companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company"."company_tags" ADD CONSTRAINT "company_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "company"."tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
