"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createDoctor, updateDoctor, deleteUser } from "../../actions/admin"
import { Loader2, Plus, Edit2, Trash2, X } from "lucide-react"

interface DoctorData {
  id: string
  name: string
  lastName: string | null
  email: string
  phone: string | null
  doctorProfile: {
    id: string
    specialty: string
    license: string
    bio: string | null
    imageUrl: string | null
  } | null
}

interface DoctorsCrudProps {
  initialDoctors: DoctorData[]
}

export default function DoctorsCrud({ initialDoctors }: DoctorsCrudProps) {
  const [doctors, setDoctors] = useState<DoctorData[]>(initialDoctors)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  // Estados para el Modal/Formulario
  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedDoctorId, setSelectedDoctorId] = useState("")
  
  // Inputs del Formulario
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [specialty, setSpecialty] = useState("")
  const [license, setLicense] = useState("")
  const [bio, setBio] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  const handleOpenCreate = () => {
    setName("")
    setLastName("")
    setEmail("")
    setPassword("")
    setPhone("")
    setSpecialty("")
    setLicense("")
    setBio("")
    setImageUrl("")
    setEditMode(false)
    setShowForm(true)
    setMessage("")
  }

  const handleOpenEdit = (doc: DoctorData) => {
    setName(doc.name)
    setLastName(doc.lastName || "")
    setEmail(doc.email)
    setPassword("") // No editar contraseña directamente aquí
    setPhone(doc.phone || "")
    setSpecialty(doc.doctorProfile?.specialty || "")
    setLicense(doc.doctorProfile?.license || "")
    setBio(doc.doctorProfile?.bio || "")
    setImageUrl(doc.doctorProfile?.imageUrl || "")
    setSelectedDoctorId(doc.id)
    setEditMode(true)
    setShowForm(true)
    setMessage("")
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (editMode) {
      formData.append("userId", selectedDoctorId)
    }

    setMessage("")
    setIsSuccess(false)

    startTransition(async () => {
      const result = editMode 
        ? await updateDoctor(formData)
        : await createDoctor(formData)
        
      setMessage(result.message)
      if (result.success) {
        setIsSuccess(true)
        setShowForm(false)
        router.refresh()
      }
    })
  }

  const handleDelete = (userId: string, docName: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar al Dr. ${docName}? Se borrará permanentemente su perfil y citas.`)) return

    setMessage("")
    startTransition(async () => {
      const result = await deleteUser(userId)
      setMessage(result.message)
      if (result.success) {
        setDoctors(doctors.filter((doc) => doc.id !== userId))
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif font-black tracking-tight">Registro de Especialistas</h2>
        <button
          onClick={handleOpenCreate}
          className="h-10 px-5 rounded-full bg-[#F4C443] hover:bg-[#E5B534] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Registrar Médico
        </button>
      </div>

      {message && !showForm && (
        <p className="text-xs font-bold text-[#E5B534] bg-[#F4C443]/10 border border-[#F4C443]/25 p-3 rounded-xl">
          {message}
        </p>
      )}

      {/* Formulario Modal flotante */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-black/10 rounded-[32px] w-full max-w-lg p-6 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh] text-black">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-xl font-serif font-black mb-6">
              {editMode ? `Editar Médico` : `Registrar Nuevo Médico`}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/60 pl-1 block">Email</label>
                  <input name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-10 px-3 text-sm outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/60 pl-1 block">Teléfono</label>
                  <input name="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-10 px-3 text-sm outline-none" />
                </div>
              </div>

              {!editMode && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/60 pl-1 block">Contraseña Temporal</label>
                  <input name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-10 px-3 text-sm outline-none" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/60 pl-1 block">Especialidad</label>
                  <input name="specialty" type="text" required value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="Ej: Pediatría" className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-10 px-3 text-sm outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-black/60 pl-1 block">Matrícula (MN)</label>
                  <input name="license" type="text" required value={license} onChange={(e) => setLicense(e.target.value)} placeholder="Ej: MN-39482" className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-10 px-3 text-sm outline-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-black/60 pl-1 block">URL de la foto de perfil (Opcional)</label>
                <input name="imageUrl" type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Ej: /avatars/avatar-3.svg" className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black h-10 px-3 text-sm outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-black/60 pl-1 block">Presentación / Bio</label>
                <textarea name="bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} className="w-full rounded-xl border border-black/10 bg-white/60 focus:bg-white text-black p-3 text-sm outline-none resize-none" />
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
                  {editMode ? "Guardar Cambios" : "Crear Médico"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla de Médicos */}
      {doctors.length === 0 ? (
        <div className="p-12 border border-dashed border-black/10 rounded-[32px] text-center bg-white/20">
          <p className="text-sm font-medium text-black/40">No hay médicos registrados.</p>
        </div>
      ) : (
        <div className="bg-white/40 border border-white/50 rounded-[32px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-black">
              <thead>
                <tr className="border-b border-black/5 bg-black/5 text-[10px] uppercase font-bold tracking-wider text-black/60">
                  <th className="py-4 px-6">Médico</th>
                  <th className="py-4 px-6">Especialidad</th>
                  <th className="py-4 px-6">Matrícula</th>
                  <th className="py-4 px-6">Contacto</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {doctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-white/40 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-black text-[#FDF6CD] flex items-center justify-center font-bold text-xs shrink-0">
                        {doc.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-black">{doc.name} {doc.lastName}</div>
                        <div className="text-[10px] text-black/40">{doc.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold">
                      {doc.doctorProfile?.specialty || "General"}
                    </td>
                    <td className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-[#E5B534]">
                      {doc.doctorProfile?.license || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-xs text-black/75 font-semibold">
                      {doc.phone || "Sin teléfono"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(doc)}
                          className="h-8 w-8 rounded-lg border border-black/5 bg-white hover:bg-black hover:text-[#FDF6CD] flex items-center justify-center text-black/70 transition-all cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id, `${doc.name} ${doc.lastName || ""}`)}
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
