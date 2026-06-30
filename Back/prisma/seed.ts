import { UserRole } from '@prisma/client';
// Hasher de better-auth (scrypt vía @better-auth/utils): el formato debe coincidir
// con el verificador de better-auth o el login dará "Invalid password" (401).
// NO usar oslo/password aquí: produce un hash incompatible.
import { hashPassword } from 'better-auth/crypto';

import { prisma } from '../src/config/prisma.js';

// ---------------------------------------------------------------------------
// Configuración del seed (autocontenida, sin variables de entorno)
// ---------------------------------------------------------------------------

const SEED_PASSWORD = 'Admin123';

// Los dos usuarios pedidos por la misión.
// El admin se gestiona como superadmin de better-auth (`isSuperAdmin`).
const ADMIN_USER = {
  email: 'admin@gastronomada.com',
  name: 'Admin GastroNómada',
  rol: UserRole.MIEMBRO,
};

const MEMBER_USER = {
  email: 'user@gastronomada.com',
  name: 'Usuario GastroNómada',
  rol: UserRole.MIEMBRO,
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('\n🌱  Iniciando seed...\n');

  const hashedPassword = await hashPassword(SEED_PASSWORD);

  // ── 1. Admin (superadmin) ──────────────────────────────────────────────────
  const adminUser = await prisma.user.upsert({
    where: { email: ADMIN_USER.email },
    update: {
      name: ADMIN_USER.name,
      isActive: true,
      isSuperAdmin: true,
      rol: ADMIN_USER.rol,
    },
    create: {
      email: ADMIN_USER.email,
      name: ADMIN_USER.name,
      emailVerified: true,
      isActive: true,
      isSystem: true,
      isSuperAdmin: true,
      rol: ADMIN_USER.rol,
    },
  });

  await prisma.account.upsert({
    where: { providerId_accountId: { providerId: 'credential', accountId: ADMIN_USER.email } },
    update: { password: hashedPassword },
    create: {
      userId: adminUser.id,
      providerId: 'credential',
      accountId: ADMIN_USER.email,
      password: hashedPassword,
    },
  });

  console.log(`   ✔ admin creado/actualizado: ${ADMIN_USER.email}`);

  // ── 2. Usuario miembro ─────────────────────────────────────────────────────
  const memberUser = await prisma.user.upsert({
    where: { email: MEMBER_USER.email },
    update: { name: MEMBER_USER.name, isActive: true, rol: MEMBER_USER.rol },
    create: {
      email: MEMBER_USER.email,
      name: MEMBER_USER.name,
      emailVerified: true,
      isActive: true,
      isSuperAdmin: false,
      rol: MEMBER_USER.rol,
    },
  });

  await prisma.account.upsert({
    where: { providerId_accountId: { providerId: 'credential', accountId: MEMBER_USER.email } },
    update: { password: hashedPassword },
    create: {
      userId: memberUser.id,
      providerId: 'credential',
      accountId: MEMBER_USER.email,
      password: hashedPassword,
    },
  });

  console.log(`   ✔ miembro creado/actualizado: ${MEMBER_USER.email}`);

  // ── Resumen ────────────────────────────────────────────────────────────────
  console.log('\n✅  Seed completado.\n');
  console.log('   Credenciales (password compartida):');
  console.log(`   • ${ADMIN_USER.email}  → admin (superadmin), rol ${ADMIN_USER.rol}`);
  console.log(`   • ${MEMBER_USER.email}  → rol ${MEMBER_USER.rol}`);
  console.log(`   • password: ${SEED_PASSWORD}\n`);
  console.log('⚠️  Cambia las contraseñas tras el primer login. No usar en producción.\n');
}

main()
  .catch((e) => {
    console.error('❌  Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
