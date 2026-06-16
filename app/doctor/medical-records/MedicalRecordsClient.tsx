"use client"

import { useState, useTransition } from "react"
import { createMedicalRecord, deleteMedicalRecord } from "../../actions/medical-records"
import { Loader2, Plus, Trash2, FileText, Stethoscope, Activity, Pill, Calendar, X } from "lucide-react"

interface Patient {
  id: string
  name: string
  lastName: string | null
  dni: string | null
  avatar?: string | null
}

interface MedicalRecord {
  id: string
  consultationDate: Date
  reason: string
  diagnosis: string
  treatment: string | null
  notes: string | null
  prescriptions: string | null
  vitalSigns: string | null
  followUpDate: Date | null
  followUpNotes: string | null
  patient: Patient
}

interface MedicalRecordsClientProps {
  initialRecords: MedicalRecord[]
  patients: Patient[]
}

export default function MedicalRecordsClient({ initialRecords, patients }: MedicalRecordsClientProps) {
  const [records, setRecords] = useState<MedicalRecord[]>(initialRecords)
  const [isPending, startTransition] = useTransition()
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState("")

  const [form, setForm] = useState({
    patientId: "",
    reason: "",
    diagnosis: "",
    treatment: "",
    notes: "",
    prescriptions: "",
    vitalSigns: "",
    followUpDate: "",
    followUpNotes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.patientId || !form.reason || !form.diagnosis) {
      setMessage("Paciente, motivo y diagnóstico son obligatorios")
      return
    }

    setMessage("")
    startTransition(async () => {
      const result = await createMedicalRecord(form)
      if (result.success) {
        setShowForm(false)
        setForm({ patientId: "", reason: "", diagnosis: "", treatment: "", notes: "", prescriptions: "", vitalSigns: "", followUpDate: "", followUpNotes: "" })
        window.location.reload()
      } else {
        setMessage(result.message)
      }
    })
  }

  const handleDelete = (recordId: string) => {
    if (!confirm("¿Eliminar este registro médico?")) return
    startTransition(async () => {
      const result = await deleteMedicalRecord(recordId)
      if (result.success) {
        setRecords((prev) => prev.filter((r) => r.id !== recordId))
      }
    })
  }

  return (
    <div className="max-w-5xl mx-auto px-8 pt-8 pb-8 mb-20 md:mb-0 space-y-6 font-sans text-black">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-black tracking-tight">Historias Clínicas</h1>
          <p className="text-sm font-medium text-black/60 mt-1">
            {records.length} registro{records.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#F4C443] hover:bg-[#E5B534] text-black rounded-2xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all active:scale-95"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancelar" : "Nuevo Registro"}
        </button>
      </div>

      {/* New Record Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-serif font-black text-lg">Nueva Historia Clínica</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-black/50">Paciente *</label>
              <select
                value={form.patientId}
                onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] transition-all"
                required
              >
                <option value="">Seleccionar paciente</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} {p.lastName || ""} {p.dni ? `(${p.dni})` : ""}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-black/50">Fecha de consulta</label>
              <input
                type="date"
                value={form.reason ? "" : ""}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-black/50">Motivo de consulta *</label>
            <input
              type="text"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="Ej: Dolor de cabeza persistente"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] transition-all"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-black/50">Diagnóstico *</label>
            <input
              type="text"
              value={form.diagnosis}
              onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
              placeholder="Ej: Migraña crónica"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-black/50">Tratamiento</label>
              <input
                type="text"
                value={form.treatment}
                onChange={(e) => setForm({ ...form, treatment: e.target.value })}
                placeholder="Ej: Medicación + descanso"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-black/50">Próximo control</label>
              <input
                type="date"
                value={form.followUpDate}
                onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-black h-11 px-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-black/50">Receta / Medicamentos</label>
            <textarea
              value={form.prescriptions}
              onChange={(e) => setForm({ ...form, prescriptions: e.target.value })}
              placeholder="Ibuprofeno 400mg cada 8hs por 5 días"
              rows={2}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-black p-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] transition-all resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-black/50">Notas adicionales</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Observaciones, indicaciones especiales..."
              rows={2}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-black p-4 text-sm outline-none focus:ring-2 focus:ring-[#F4C443] transition-all resize-none"
            />
          </div>

          {message && (
            <p className="text-xs font-bold text-red-500">{message}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 text-xs font-bold text-black/50 hover:text-black transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-[#FDF6CD] rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-black/80 transition-all active:scale-95 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              Guardar Registro
            </button>
          </div>
        </form>
      )}

      {/* Records List */}
      {records.length === 0 ? (
        <div className="p-14 border-2 border-dashed border-gray-200 rounded-2xl text-center bg-gray-50 space-y-4">
          <FileText className="h-12 w-12 text-black/20 mx-auto" />
          <p className="text-sm font-bold text-black/40">No hay registros médicos aún</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => {
            const date = new Date(record.consultationDate)
            return (
              <div key={record.id} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-base text-black">{record.patient.name} {record.patient.lastName || ""}</h3>
                    <p className="text-[10px] text-black/40 font-bold uppercase tracking-wider">
                      {date.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="p-2 rounded-xl hover:bg-red-50 text-red-400 hover:text-red-600 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <Stethoscope className="w-3.5 h-3.5 text-[#8B5A2B] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[9px] uppercase font-bold tracking-widest text-black/40">Motivo</p>
                      <p className="text-xs font-semibold text-black">{record.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Activity className="w-3.5 h-3.5 text-[#F4C443] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[9px] uppercase font-bold tracking-widest text-black/40">Diagnóstico</p>
                      <p className="text-xs font-semibold text-black">{record.diagnosis}</p>
                    </div>
                  </div>
                  {record.treatment && (
                    <div className="flex items-start gap-2">
                      <Pill className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[9px] uppercase font-bold tracking-widest text-black/40">Tratamiento</p>
                        <p className="text-xs font-semibold text-black">{record.treatment}</p>
                      </div>
                    </div>
                  )}
                  {record.prescriptions && (
                    <div className="flex items-start gap-2">
                      <FileText className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[9px] uppercase font-bold tracking-widest text-black/40">Receta</p>
                        <p className="text-xs font-semibold text-black">{record.prescriptions}</p>
                      </div>
                    </div>
                  )}
                </div>

                {record.followUpDate && (
                  <div className="mt-3 inline-flex items-center gap-1.5 bg-[#F4C443]/10 px-3 py-1.5 rounded-xl">
                    <Calendar className="w-3 h-3 text-[#F4C443]" />
                    <span className="text-[10px] font-bold text-black/60">
                      Control: {new Date(record.followUpDate).toLocaleDateString("es-ES", { day: "numeric", month: "long" })}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
