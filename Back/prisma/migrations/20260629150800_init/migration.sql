/*
  Warnings:

  - You are about to drop the column `password` on the `auth_users` table. All the data in the column will be lost.
  - You are about to drop the `auth_email_verification_codes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auth_keys` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auth_password_reset_tokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auth_verification_tokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `document` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `org_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `org_organizations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `org_team_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `org_teams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rbac_entity_access` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rbac_modules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rbac_role_assignments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rbac_role_permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rbac_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `test_companies` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('MIEMBRO', 'NO_MIEMBRO');

-- DropForeignKey
ALTER TABLE "auth_keys" DROP CONSTRAINT "auth_keys_userId_fkey";

-- DropForeignKey
ALTER TABLE "document" DROP CONSTRAINT "document_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "document" DROP CONSTRAINT "document_deletedBy_fkey";

-- DropForeignKey
ALTER TABLE "document" DROP CONSTRAINT "document_restoreBy_fkey";

-- DropForeignKey
ALTER TABLE "document" DROP CONSTRAINT "document_updatedBy_fkey";

-- DropForeignKey
ALTER TABLE "org_members" DROP CONSTRAINT "org_members_invitedBy_fkey";

-- DropForeignKey
ALTER TABLE "org_members" DROP CONSTRAINT "org_members_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "org_members" DROP CONSTRAINT "org_members_userId_fkey";

-- DropForeignKey
ALTER TABLE "org_organizations" DROP CONSTRAINT "org_organizations_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "org_organizations" DROP CONSTRAINT "org_organizations_deletedBy_fkey";

-- DropForeignKey
ALTER TABLE "org_organizations" DROP CONSTRAINT "org_organizations_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "org_organizations" DROP CONSTRAINT "org_organizations_ownerOrganizationId_fkey";

-- DropForeignKey
ALTER TABLE "org_organizations" DROP CONSTRAINT "org_organizations_ownerTeamId_fkey";

-- DropForeignKey
ALTER TABLE "org_organizations" DROP CONSTRAINT "org_organizations_restoreBy_fkey";

-- DropForeignKey
ALTER TABLE "org_organizations" DROP CONSTRAINT "org_organizations_updatedBy_fkey";

-- DropForeignKey
ALTER TABLE "org_team_members" DROP CONSTRAINT "org_team_members_invitedBy_fkey";

-- DropForeignKey
ALTER TABLE "org_team_members" DROP CONSTRAINT "org_team_members_memberId_fkey";

-- DropForeignKey
ALTER TABLE "org_team_members" DROP CONSTRAINT "org_team_members_teamId_fkey";

-- DropForeignKey
ALTER TABLE "org_teams" DROP CONSTRAINT "org_teams_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "org_teams" DROP CONSTRAINT "org_teams_deletedBy_fkey";

-- DropForeignKey
ALTER TABLE "org_teams" DROP CONSTRAINT "org_teams_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "org_teams" DROP CONSTRAINT "org_teams_restoreBy_fkey";

-- DropForeignKey
ALTER TABLE "org_teams" DROP CONSTRAINT "org_teams_updatedBy_fkey";

-- DropForeignKey
ALTER TABLE "rbac_entity_access" DROP CONSTRAINT "rbac_entity_access_grantedBy_fkey";

-- DropForeignKey
ALTER TABLE "rbac_entity_access" DROP CONSTRAINT "rbac_entity_access_revokedBy_fkey";

-- DropForeignKey
ALTER TABLE "rbac_modules" DROP CONSTRAINT "rbac_modules_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "rbac_modules" DROP CONSTRAINT "rbac_modules_deletedBy_fkey";

-- DropForeignKey
ALTER TABLE "rbac_modules" DROP CONSTRAINT "rbac_modules_restoreBy_fkey";

-- DropForeignKey
ALTER TABLE "rbac_modules" DROP CONSTRAINT "rbac_modules_updatedBy_fkey";

-- DropForeignKey
ALTER TABLE "rbac_role_assignments" DROP CONSTRAINT "rbac_role_assignments_assignedBy_fkey";

-- DropForeignKey
ALTER TABLE "rbac_role_assignments" DROP CONSTRAINT "rbac_role_assignments_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "rbac_role_assignments" DROP CONSTRAINT "rbac_role_assignments_roleId_fkey";

-- DropForeignKey
ALTER TABLE "rbac_role_assignments" DROP CONSTRAINT "rbac_role_assignments_teamId_fkey";

-- DropForeignKey
ALTER TABLE "rbac_role_assignments" DROP CONSTRAINT "rbac_role_assignments_userId_fkey";

-- DropForeignKey
ALTER TABLE "rbac_role_permissions" DROP CONSTRAINT "rbac_role_permissions_grantedBy_fkey";

-- DropForeignKey
ALTER TABLE "rbac_role_permissions" DROP CONSTRAINT "rbac_role_permissions_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "rbac_role_permissions" DROP CONSTRAINT "rbac_role_permissions_roleId_fkey";

-- DropForeignKey
ALTER TABLE "rbac_role_permissions" DROP CONSTRAINT "rbac_role_permissions_updatedBy_fkey";

-- DropForeignKey
ALTER TABLE "rbac_roles" DROP CONSTRAINT "rbac_roles_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "rbac_roles" DROP CONSTRAINT "rbac_roles_deletedBy_fkey";

-- DropForeignKey
ALTER TABLE "rbac_roles" DROP CONSTRAINT "rbac_roles_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "rbac_roles" DROP CONSTRAINT "rbac_roles_restoreBy_fkey";

-- DropForeignKey
ALTER TABLE "rbac_roles" DROP CONSTRAINT "rbac_roles_updatedBy_fkey";

-- DropForeignKey
ALTER TABLE "test_companies" DROP CONSTRAINT "test_companies_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "test_companies" DROP CONSTRAINT "test_companies_deletedBy_fkey";

-- DropForeignKey
ALTER TABLE "test_companies" DROP CONSTRAINT "test_companies_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "test_companies" DROP CONSTRAINT "test_companies_ownerOrganizationId_fkey";

-- DropForeignKey
ALTER TABLE "test_companies" DROP CONSTRAINT "test_companies_ownerTeamId_fkey";

-- DropForeignKey
ALTER TABLE "test_companies" DROP CONSTRAINT "test_companies_restoreBy_fkey";

-- DropForeignKey
ALTER TABLE "test_companies" DROP CONSTRAINT "test_companies_updatedBy_fkey";

-- AlterTable
ALTER TABLE "auth_users" DROP COLUMN "password",
ADD COLUMN     "rol" "UserRole" NOT NULL DEFAULT 'MIEMBRO';

-- DropTable
DROP TABLE "auth_email_verification_codes";

-- DropTable
DROP TABLE "auth_keys";

-- DropTable
DROP TABLE "auth_password_reset_tokens";

-- DropTable
DROP TABLE "auth_verification_tokens";

-- DropTable
DROP TABLE "document";

-- DropTable
DROP TABLE "org_members";

-- DropTable
DROP TABLE "org_organizations";

-- DropTable
DROP TABLE "org_team_members";

-- DropTable
DROP TABLE "org_teams";

-- DropTable
DROP TABLE "rbac_entity_access";

-- DropTable
DROP TABLE "rbac_modules";

-- DropTable
DROP TABLE "rbac_role_assignments";

-- DropTable
DROP TABLE "rbac_role_permissions";

-- DropTable
DROP TABLE "rbac_roles";

-- DropTable
DROP TABLE "test_companies";

-- DropEnum
DROP TYPE "EntityAccessLevel";

-- DropEnum
DROP TYPE "PermissionAction";

-- DropEnum
DROP TYPE "PermissionScope";

-- DropEnum
DROP TYPE "PrincipalType";

-- DropEnum
DROP TYPE "RecordStatus";

-- CreateTable
CREATE TABLE "recetas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "raciones" TEXT,
    "ingredientes" TEXT[],
    "pasos" TEXT[],
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recetas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensajes" (
    "id" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "mensajes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversaciones" (
    "id" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversacion_mensajes" (
    "id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "propio" BOOLEAN NOT NULL DEFAULT false,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "conversacionId" TEXT NOT NULL,

    CONSTRAINT "conversacion_mensajes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "recetas_userId_idx" ON "recetas"("userId");

-- CreateIndex
CREATE INDEX "recetas_nombre_idx" ON "recetas"("nombre");

-- CreateIndex
CREATE INDEX "mensajes_userId_idx" ON "mensajes"("userId");

-- CreateIndex
CREATE INDEX "mensajes_fecha_idx" ON "mensajes"("fecha");

-- CreateIndex
CREATE INDEX "conversaciones_userId_idx" ON "conversaciones"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "conversaciones_userId_usuario_key" ON "conversaciones"("userId", "usuario");

-- CreateIndex
CREATE INDEX "conversacion_mensajes_conversacionId_idx" ON "conversacion_mensajes"("conversacionId");

-- AddForeignKey
ALTER TABLE "recetas" ADD CONSTRAINT "recetas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensajes" ADD CONSTRAINT "mensajes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversaciones" ADD CONSTRAINT "conversaciones_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversacion_mensajes" ADD CONSTRAINT "conversacion_mensajes_conversacionId_fkey" FOREIGN KEY ("conversacionId") REFERENCES "conversaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;
