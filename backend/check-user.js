import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUser() {
  try {
    // Find Sweet Corner user
    const user = await prisma.user.findUnique({
      where: { email: 'sweetcorner@example.com' }
    });

    console.log('Sweet Corner user:');
    console.log(JSON.stringify(user, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
