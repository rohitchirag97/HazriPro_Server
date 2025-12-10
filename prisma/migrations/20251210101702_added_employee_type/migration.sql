-- CreateEnum
CREATE TYPE "EmployeeType" AS ENUM ('FULL_TIME', 'CONTRACT');

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "employeeType" "EmployeeType" NOT NULL DEFAULT 'FULL_TIME',
ADD COLUMN     "isEmployee" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "salary" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
