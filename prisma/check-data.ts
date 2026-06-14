
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log("✅ Conectando a la base de datos...")
    const users = await prisma.user.findMany()
    console.log("\n👥 Usuarios en la base de datos:")
    users.forEach(u => {
        console.log(`- ID: ${u.id} | Nombre: ${u.name} ${u.lastName || ''} | Rol: ${u.role} | Email: ${u.email}`)
    })

    const doctors = await prisma.user.findMany({
        where: { role: "DOCTOR" },
        include: { doctorProfile: true }
    })
    console.log(`\n🏥 Total médicos: ${doctors.length}`)
    doctors.forEach(d => {
        console.log(`- ${d.name} ${d.lastName} | Perfil: ${d.doctorProfile ? "Creado" : "NO CREADO"}`)
        if(d.doctorProfile) {
            console.log(`  Especialidad: ${d.doctorProfile.specialty} | Matrícula: ${d.doctorProfile.license}`)
        }
    })
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
