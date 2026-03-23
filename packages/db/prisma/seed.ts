import {
  PrismaClient,
} from '@mezon-tutors/db';

const prisma = new PrismaClient();

async function main() {
  console.log('--- START SEEDING ---');

  // 1. Clean up everything first to avoid conflicts
  console.log('Cleaning up all data...');

  // 2. Seed Reference Data
  console.log('Seeding reference data...');

  console.log('--- SEEDING FINISHED SUCCESSFULLY ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
