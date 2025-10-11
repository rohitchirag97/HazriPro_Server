-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EMPLOYEE');

-- AlterTable
ALTER TABLE "employee" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'EMPLOYEE';
