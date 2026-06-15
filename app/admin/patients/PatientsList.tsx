"use client"

import { useState, useTransition } from "react"
import { updatePatient, deleteUser } from "../../actions/admin"
import { Loader2, Edit2, Trash2, X } from "lucide-react"

interface PatientData {
  id: string
  name: string
  lastName: string | null
  email: string
  phone: string | null
  dni: string | null
  insurance: string | null
  birthDate: Date | null
}

interface PatientsListProps {
  initialPatients: PatientData[]
}

export default function PatientsList({ initialPatients }: PatientsListProps) {
  const [patients, setPatients] = useState<PatientData[]>(initialPatients)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  // Estados para el Modal/Formulario
  const [showForm, setShowForm] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState("")
  
  // Inputs del Formulario
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [dni, setDni] = useState("")
  const [insurance, setInsurance] = useState("")
  const [birthDate, setBirthDate] = useState("")

  const handleOpenEdit = (pat: PatientData) => {
    setName(pat.name)
    setLastName(pat.lastName || "")
    setEmail(pat.email)
    setPhone(pat.phone || "")
    setDni(pat.dni || "")
    setInsurance(pat.insurance || "")
    
    // Formatear fecha para el input date
    if (pat.birthDate) {
      const d = new Date(pat.birthDate)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, "0")
      const day = String(d.getDate()).padStart(2, "0")
      setBirthDate(`${year}-${month}-${day}`)
    } else {
      setBirthDate("")
    }

    setSelectedPatientId(pat.id)
    setShowForm(true)
    setMessage("")
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.append("userId", selectedPatientId)

    setMessage("")
    setIsSuccess(false)

    startTransition(async () => {
      const result = await updatePatient(formData)
      setMessage(result.message)
      if (result.success) {
        setIsSuccess(true)
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    })
  }

  const handleDelete = (userId: string, patName: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar a ${patName}? Se borrará permanentemente su usuario y citas.`)) return

    setMessage("")
    startTransition(async () => {
      const result = await deleteUser(userId)
      setMessage(result.message)
      if (result.success) {
        setPatients(patients.filter((pat) => pat.id !== userId))
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif font-black tracking-tight">Listado de Pacientes</h2>
        <span className="text-xs font-bold uppercase tracking-widest text-black/40">
          Total: {patients.length} pacientes
        </span>
      </div>

      {message && !showForm && (
        <p className="text-xs font-bold text-[#E5B534] bg-[#F4C443]/10 border border-[#F4C443]/25 p-3 rounded-xl">
          {message}
        </p>
      )}

      {/* Formulario Modal flotante */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FDF6CD] border border-black/10 rounded-[32px] w-full max-w-lg p-6 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh] text-black">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-xl font-serif font-black mb-6">
              Editar Datos del Paciente
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/60 pl-1 block">Nombre</label>
                  <input name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-10 px-3 text-sm outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/60 pl-1 block">Apellido</label>
                  <input name="lastName" type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-10 px-3 text-sm outline-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-black/40 pl-1 block">Email (No modificable)</label>
                <input name="email" type="email" disabled value={email} className="w-full rounded-xl border border-black/5 bg-black/5 text-black/40 h-10 px-3 text-sm outline-none cursor-not-allowed" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/60 pl-1 block">DNI</label>
                  <input name="dni" type="text" value={dni} onChange={(e) => setDni(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-10 px-3 text-sm outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/60 pl-1 block">Teléfono</label>
                  <input name="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-10 px-3 text-sm outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/60 pl-1 block">Fecha de Nacimiento</label>
                  <input name="birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-10 px-3 text-sm outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/60 pl-1 block">Obra Social</label>
                  <input name="insurance" type="text" value={insurance} onChange={(e) => setInsurance(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-10 px-3 text-sm outline-none" />
                </div>
              </div>

              <div className="pt-2">
                {message && (
                  <p className={`text-xs font-bold text-center mb-3 ${isSuccess ? "text-[#E5B534]" : "text-red-500"}`}>
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-11 rounded-full bg-black hover:bg-black/80 text-[#FDF6CD] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla de Pacientes */}
      {patients.length === 0 ? (
        <div className="p-12 border border-dashed border-black/10 rounded-[32px] text-center bg-white/20">
          <p className="text-sm font-medium text-black/40">No hay pacientes registrados.</p>
        </div>
      ) : (
        <div className="bg-white/40 border border-white/50 rounded-[32px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-black">
              <thead>
                <tr className="border-b border-black/5 bg-black/5 text-[10px] uppercase font-bold tracking-wider text-black/60">
                  <th className="py-4 px-6">Paciente</th>
                  <th className="py-4 px-6">DNI</th>
                  <th className="py-4 px-6">Prepaga</th>
                  <th className="py-4 px-6">Contacto</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {patients.map((pat) => (
                  <tr key={pat.id} className="hover:bg-white/40 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-black text-[#FDF6CD] flex items-center justify-center font-bold text-xs shrink-0">
                        {pat.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-black">{pat.name} {pat.lastName}</div>
                        <div className="text-[10px] text-black/40">{pat.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-xs">
                      {pat.dni || "N/R"}
                    </td>
                    <td className="py-4 px-6 text-xs text-[#E5B534] font-bold">
                      {pat.insurance || "Ninguna"}
                    </td>
                    <td className="py-4 px-6 text-xs text-black/75 font-semibold">
                      {pat.phone || "Sin teléfono"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(pat)}
                          className="h-8 w-8 rounded-lg border border-black/5 bg-white hover:bg-black hover:text-[#FDF6CD] flex items-center justify-center text-black/70 transition-all cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(pat.id, `${pat.name} ${pat.lastName || ""}`)}
                          className="h-8 w-8 rounded-lg border border-red-100 hover:bg-red-500 hover:border-red-500 hover:text-white flex items-center justify-center text-red-600 transition-all cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
