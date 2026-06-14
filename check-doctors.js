const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDoctors() {
  try {
    const doctors = await prisma.user.findMany({
      where: { role: 'DOCTOR' },
      select: { id: true, name: true, lastName: true, avatar: true }
    });
    
    console.log('Médicos encontrados:', doctors.length);
    doctors.forEach(doc => {
      console.log(`- Dr. ${doc.name} ${doc.lastName || ''}: avatar='${doc.avatar}'`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDoctors();