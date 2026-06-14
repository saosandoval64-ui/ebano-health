-- CreateTable
CREATE TABLE "FavoriteDoctor" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteDoctor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteDoctor_patientId_doctorId_key" ON "FavoriteDoctor"("patientId", "doctorId");

-- AddForeignKey
ALTER TABLE "FavoriteDoctor" ADD CONSTRAINT "FavoriteDoctor_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteDoctor" ADD CONSTRAINT "FavoriteDoctor_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "DoctorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
