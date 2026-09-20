"use client"

import { useState, useRef, useTransition } from "react"
import { useRouter } from "next/navigation"
import { deleteDocument } from "@/app/actions/medical-documents"
import {
  FileText, FlaskConical, Image, Pill, Upload, Trash2,
  Download, X, Loader2, CheckCircle2, AlertCircle
} from "lucide-react"

type Patient = { id: string; name: string; lastName: string | null }
type Document = {
  id: string
  title: string
  fileType: string
  fileUrl: string
  description: string | null
  uploadedAt: Date
  patient: { name: string; lastName: string | null }
}

const FILE_TYPES = [
  { value: "lab_result", label: "Análisis clínico", icon: FlaskConical },
  { value: "imaging", label: "Imagenología", icon: Image },
  { value: "prescription", label: "Receta", icon: Pill },
  { value: "other", label: "Otro documento", icon: FileText },
]

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  lab_result: { label: "Análisis clínico", color: "text-purple-500" },
  imaging: { label: "Imagenología", color: "text-blue-500" },
  prescription: { label: "Receta", color: "text-green-500" },
  other: { label: "Documento", color: "text-black/40" },
}

export default function DoctorDocumentsClient({
  patients,
  documents: initialDocuments,
}: {
  patients: Patient[]
  documents: Document[]
}) {
  const router = useRouter()
  const [documents, setDocuments] = useState(initialDocuments)
  const [isPending, startTransition] = useTransition()

  // Form state
  const [patientId, setPatientId] = useState("")
  const [title, setTitle] = useState("")
  const [fileType, setFileType] = useState("lab_result")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(f: File | null) {
    if (!f) return
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowed.includes(f.type)) {
      setMsg({ type: "err", text: "Solo se permiten PDF e imágenes (JPG, PNG, WebP, GIF)." })
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      setMsg({ type: "err", text: "El archivo supera el límite de 10 MB." })
      return
    }
    setFile(f)
    setMsg(null)
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!file || !patientId || !title) {
      setMsg({ type: "err", text: "Completá todos los campos requeridos." })
      return
    }
    setUploading(true)
    setMsg(null)

    const fd = new FormData()
    fd.append("file", file)
    fd.append("patientId", patientId)
    fd.append("title", title)
    fd.append("fileType", fileType)
    if (description) fd.append("description", description)

    try {
      const res = await fetch("/api/documents", { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setMsg({ type: "err", text: data.error ?? "Error al subir el documento." })
      } else {
        setMsg({ type: "ok", text: "Documento subido correctamente." })
        setTitle("")
        setDescription("")
        setFile(null)
        setPatientId("")
        if (fileRef.current) fileRef.current.value = ""
        router.refresh()
      }
    } catch {
      setMsg({ type: "err", text: "Error de red. Intentá de nuevo." })
    } finally {
      setUploading(false)
    }
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteDocument(id)
      if (result.success) {
        setDocuments((prev) => prev.filter((d) => d.id !== id))
      } else {
        setMsg({ type: "err", text: result.message })
      }
    })
  }

  return (
    <div className="max-w-5xl mx-auto px-8 pt-8 pb-12 space-y-10 font-sans text-black">
      {/* Header */}
      <div>
        <p className="text-xs font-bold text-black/40 uppercase tracking-widest mb-1">Gestión</p>
        <h1 className="text-3xl font-serif font-black tracking-tight">Documentos Médicos</h1>
        <p className="text-sm text-black/50 font-medium mt-1">
          Subí análisis, estudios o recetas para tus pacientes.
        </p>
      </div>

      {/* Formulario de subida */}
      <form
        onSubmit={handleUpload}
        className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-6"
      >
        <h2 className="font-black text-base tracking-tight">Subir nuevo documento</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Paciente */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-black/50">
              Paciente <span className="text-red-400">*</span>
            </label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/30 transition"
            >
              <option value="">Seleccioná un paciente</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.lastName ?? ""}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-black/50">
              Tipo de documento <span className="text-red-400">*</span>
            </label>
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/30 transition"
            >
              {FILE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Título */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-black/50">
              Título <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Hemograma completo — junio 2025"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium placeholder:text-black/25 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/30 transition"
            />
          </div>

          {/* Descripción */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-black/50">
              Descripción (opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Notas o indicaciones adicionales..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium placeholder:text-black/25 resize-none focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/30 transition"
            />
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            handleFile(e.dataTransfer.files[0] ?? null)
          }}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
            dragOver
              ? "border-black/40 bg-black/5"
              : file
              ? "border-emerald-300 bg-emerald-50"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,.gif"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              <p className="text-sm font-bold text-emerald-700">{file.name}</p>
              <p className="text-xs text-emerald-500">{(file.size / 1024).toFixed(0)} KB</p>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setFile(null) }}
                className="mt-1 text-xs text-black/40 hover:text-black font-bold flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Quitar archivo
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-black/20" />
              <p className="text-sm font-bold text-black/50">
                Arrastrá un archivo o <span className="text-black underline underline-offset-2">hacé clic para seleccionar</span>
              </p>
              <p className="text-xs text-black/30">PDF o imagen — máx. 10 MB</p>
            </div>
          )}
        </div>

        {/* Feedback */}
        {msg && (
          <div className={`flex items-center gap-2 text-sm font-medium rounded-xl px-4 py-3 ${
            msg.type === "ok"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-600"
          }`}>
            {msg.type === "ok"
              ? <CheckCircle2 className="w-4 h-4 shrink-0" />
              : <AlertCircle className="w-4 h-4 shrink-0" />}
            {msg.text}
          </div>
        )}

        <button
          type="submit"
          disabled={uploading || !file}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-black text-white rounded-xl font-bold text-sm hover:bg-black/85 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Subiendo...</>
          ) : (
            <><Upload className="w-4 h-4" /> Subir documento</>
          )}
        </button>
      </form>

      {/* Lista de documentos subidos */}
      <div className="space-y-4">
        <h2 className="font-black text-base tracking-tight">
          Documentos subidos <span className="text-black/30 font-medium">({documents.length})</span>
        </h2>

        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-100 rounded-3xl">
            <FileText className="w-10 h-10 text-black/10 mb-3" />
            <p className="text-sm font-bold text-black/30">Todavía no subiste documentos</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => {
              const cfg = TYPE_CONFIG[doc.fileType] ?? TYPE_CONFIG.other
              return (
                <div
                  key={doc.id}
                  className="bg-white border border-gray-100 rounded-2xl p-5 flex items-start gap-4 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                    <FileText className={`w-4.5 h-4.5 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-black truncate">{doc.title}</p>
                        <p className="text-[10px] text-black/40 font-bold mt-0.5">
                          {doc.patient.name} {doc.patient.lastName ?? ""} ·{" "}
                          <span className={cfg.color}>{cfg.label}</span>
                        </p>
                        {doc.description && (
                          <p className="text-xs text-black/50 mt-1 line-clamp-1">{doc.description}</p>
                        )}
                      </div>
                      <p className="text-[10px] text-black/30 font-bold shrink-0">
                        {new Date(doc.uploadedAt).toLocaleDateString("es-ES", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"
                      title="Abrir documento"
                    >
                      <Download className="w-3.5 h-3.5 text-black/50" />
                    </a>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      disabled={isPending}
                      className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors disabled:opacity-40"
                      title="Eliminar documento"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
