import { getCurrentUser } from "../../../lib/auth"
import { redirect } from "next/navigation"
import PatientSettingsClient from "./PatientSettingsClient"

export default async function PatientSettingsPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== "PATIENT") return redirect("/login")

  return (
    <PatientSettingsClient
      initialAvatar={user.avatar || undefined}
    />
  )
}
