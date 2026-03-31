
import { prisma } from '../src/config/prisma';
import { seedDatabase } from '../src/utils/seed';



async function main() {
  try {
    await seedDatabase();
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
