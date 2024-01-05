/*
  Warnings:

  - You are about to drop the column `email_verified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user"."users" DROP COLUMN "email_verified",
DROP COLUMN "password",
ADD COLUMN     "picture" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "country_code" DROP NOT NULL,
ALTER COLUMN "phone_number" DROP NOT NULL;

-- CreateTable
CREATE TABLE "user"."federated_credentials" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "federated_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user"."sessions" (
    "sid" TEXT NOT NULL,
    "sess" JSONB NOT NULL,
    "expire" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("sid")
);

-- CreateIndex
CREATE UNIQUE INDEX "federated_credentials_access_token_key" ON "user"."federated_credentials"("access_token");

-- CreateIndex
CREATE UNIQUE INDEX "federated_credentials_refresh_token_key" ON "user"."federated_credentials"("refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sid_key" ON "user"."sessions"("sid");

-- AddForeignKey
ALTER TABLE "user"."federated_credentials" ADD CONSTRAINT "federated_credentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
