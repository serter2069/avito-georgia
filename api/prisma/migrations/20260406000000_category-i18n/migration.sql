-- AlterTable: add i18n fields to Category (mirrors City model pattern)
ALTER TABLE "Category" ADD COLUMN "nameKa" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Category" ADD COLUMN "nameRu" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Category" ADD COLUMN "nameEn" TEXT NOT NULL DEFAULT '';
