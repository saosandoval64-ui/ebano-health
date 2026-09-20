-- Evita doble reserva del mismo médico en el mismo horario a nivel de base de datos.
-- Solo aplica a citas activas (RESERVED/PENDING); las canceladas no cuentan,
-- por lo que un horario cancelado puede volver a reservarse.
-- No borra ni modifica datos existentes: si ya hubiera un conflicto real en
-- producción, esta migración fallará y avisará (no se ejecuta a ciegas).
CREATE UNIQUE INDEX IF NOT EXISTS "appointment_doctor_slot_unique"
ON "Appointment" ("doctorId", "dateTime")
WHERE "status" IN ('RESERVED', 'PENDING');
