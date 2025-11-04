import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixAdmin() {
  try {
    // Find all users
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, status: true }
    });

    console.log('Current users:');
    console.log(JSON.stringify(users, null, 2));

    // Find admin user
    const adminUser = users.find(u => u.role === 'ADMIN');

    if (adminUser) {
      console.log('\nFound admin user:', adminUser.email);

      if (adminUser.status !== 'APPROVED') {
        // Update admin status to APPROVED
        const updated = await prisma.user.update({
          where: { id: adminUser.id },
          data: { status: 'APPROVED' }
        });
        console.log('Admin user status updated to APPROVED');
        console.log('Updated user:', JSON.stringify(updated, null, 2));
      } else {
        console.log('Admin user is already APPROVED');
      }
    } else {
      console.log('No admin user found!');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAdmin();
