-- DropForeignKey
ALTER TABLE "user"."federated_credentials" DROP CONSTRAINT "federated_credentials_user_id_fkey";

-- AddForeignKey
ALTER TABLE "user"."federated_credentials" ADD CONSTRAINT "federated_credentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
