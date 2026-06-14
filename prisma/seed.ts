import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting DB Seeding...")

  // Delete existing data to prevent unique constraints errors
  await prisma.availability.deleteMany()
  await prisma.appointment.deleteMany()
  await prisma.doctorProfile.deleteMany()
  await prisma.user.deleteMany()

  // 1. Create Admin with specified credentials
  const adminPassword = await bcrypt.hash("Ssao2004", 10)
  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      lastName: "Ébano",
      email: "perlazasandoval9@gmail.com",
      password: adminPassword,
      role: "ADMIN",
    },
  })
  console.log("Created Admin:", admin.email)

  // 2. Create Doctors
  const doctorPassword = await bcrypt.hash("doctorpassword123", 10)
  
  const doc1 = await prisma.user.create({
    data: {
      name: "Sofía",
      lastName: "Rodríguez",
      email: "doctor1@ebano.com",
      password: doctorPassword,
      role: "DOCTOR",
      phone: "+54 11 5555-1234",
      avatar: "1",
    },
  })

  await prisma.doctorProfile.create({
    data: {
      userId: doc1.id,
      specialty: "Pediatría",
      license: "MN-48291",
      bio: "Médica pediatra con más de 10 años de trayectoria. Dedicada a la atención integral del lactante, niño y adolescente.",
      imageUrl: "/avatars/avatar-1.svg",
    },
  })
  console.log("Created Doctor 1 (Pediatrician):", doc1.email)

  // Availability for Doctor 1 - Lunes a Viernes 9:00-17:00
  const doc1Profile = await prisma.doctorProfile.findUnique({ where: { userId: doc1.id } })
  if (doc1Profile) {
    await prisma.availability.createMany({
      data: Array.from({ length: 5 }, (_, i) => ({
        doctorId: doc1Profile.id,
        dayOfWeek: i,
        startTime: "09:00",
        endTime: "17:00",
        isActive: true,
      })),
    })
  }

  const doc2 = await prisma.user.create({
    data: {
      name: "Mateo",
      lastName: "González",
      email: "doctor2@ebano.com",
      password: doctorPassword,
      role: "DOCTOR",
      phone: "+54 11 5555-5678",
      avatar: "2",
    },
  })

  await prisma.doctorProfile.create({
    data: {
      userId: doc2.id,
      specialty: "Cardiología",
      license: "MN-92813",
      bio: "Especialista en cardiología clínica, ecocardiografía y prevención de enfermedades cardiovasculares en adultos.",
      imageUrl: "/avatars/avatar-2.svg",
    },
  })
  console.log("Created Doctor 2 (Cardiologist):", doc2.email)

  // Availability for Doctor 2 - Lunes a Viernes 10:00-18:00
  const doc2Profile = await prisma.doctorProfile.findUnique({ where: { userId: doc2.id } })
  if (doc2Profile) {
    await prisma.availability.createMany({
      data: Array.from({ length: 5 }, (_, i) => ({
        doctorId: doc2Profile.id,
        dayOfWeek: i,
        startTime: "10:00",
        endTime: "18:00",
        isActive: true,
      })),
    })
  }

  // 3. Create Patient
  const patientPassword = await bcrypt.hash("patientpassword123", 10)
  const patient = await prisma.user.create({
    data: {
      name: "Juan",
      lastName: "Pérez",
      email: "paciente@ebano.com",
      password: patientPassword,
      role: "PATIENT",
      avatar: "3",
      dni: "45678912",
      phone: "+54 11 4444-9999",
      birthDate: new Date("1992-08-24"),
      insurance: "OSDE 310",
    },
  })
  console.log("Created Patient:", patient.email)

  console.log("DB Seeding completed successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })