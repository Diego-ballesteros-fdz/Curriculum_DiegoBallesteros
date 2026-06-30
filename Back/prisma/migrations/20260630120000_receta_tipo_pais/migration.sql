-- CreateEnum
CREATE TYPE "TipoReceta" AS ENUM ('tradicional', 'moderna');

-- AlterTable
ALTER TABLE "recetas" ADD COLUMN     "pais" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "tipo" "TipoReceta" NOT NULL DEFAULT 'tradicional';

-- CreateIndex
CREATE INDEX "recetas_tipo_idx" ON "recetas"("tipo");

-- CreateIndex
CREATE INDEX "recetas_pais_idx" ON "recetas"("pais");
