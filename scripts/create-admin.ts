import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import readline from 'readline';

const prisma = new PrismaClient();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper function to ask questions
const askQuestion = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
};

async function createAdmin() {
  console.log('\n🔐 Create Admin User\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Get user input
  const email = await askQuestion('📧 Email: ');
  const name = await askQuestion('👤 Name: ');
  const password = await askQuestion('🔑 Password: ');
  
  // Confirm
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 Review:');
  console.log(`   Email: ${email}`);
  console.log(`   Name: ${name}`);
  console.log(`   Password: ${'•'.repeat(password.length)}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const confirm = await askQuestion('✅ Create this admin user? (y/n): ');

  if (confirm.toLowerCase() !== 'y') {
    console.log('\n❌ Cancelled.\n');
    rl.close();
    await prisma.$disconnect();
    return;
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the admin user
    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        passwordHash: hashedPassword,
        role: 'ADMIN',
      },
      create: {
        email,
        name,
        passwordHash: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   📧 Email: ${admin.email}`);
    console.log(`   👤 Name: ${admin.name}`);
    console.log(`   🔑 Role: ${admin.role}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🔐 You can now login at: http://localhost:3000/admin/login\n');

  } catch (error) {
    console.error('\n❌ Error creating admin:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

// Run the script
createAdmin();