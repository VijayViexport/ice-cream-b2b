-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "notes" TEXT;
