/*
  Warnings:

  - The `role` column on the `Employee` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Employee` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('EMPLOYEE', 'OWNER', 'MANAGER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'EMPLOYEE',
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';
