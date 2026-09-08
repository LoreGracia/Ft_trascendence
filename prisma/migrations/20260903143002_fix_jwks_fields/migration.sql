-- AlterTable
ALTER TABLE "jwks" ADD COLUMN     "alg" TEXT,
ADD COLUMN     "crv" TEXT,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ALTER COLUMN "createdAt" DROP DEFAULT;
