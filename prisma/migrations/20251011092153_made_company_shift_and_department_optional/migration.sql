-- DropForeignKey
ALTER TABLE "public"."employee" DROP CONSTRAINT "employee_companyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."employee" DROP CONSTRAINT "employee_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."employee" DROP CONSTRAINT "employee_shiftId_fkey";

-- AlterTable
ALTER TABLE "employee" ALTER COLUMN "shiftId" DROP NOT NULL,
ALTER COLUMN "departmentId" DROP NOT NULL,
ALTER COLUMN "companyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "shift"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
