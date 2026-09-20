import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getConversations } from "@/app/actions/messages"
import ConversationList from "./ConversationList"

export default async function MensajesPage() {
  const session = await auth()
  if (!session?.user) return redirect("/login")

  const conversations = await getConversations()

  return (
    <div className="max-w-5xl mx-auto px-8 pt-8 pb-12 font-sans text-black">
      <div className="mb-8">
        <p className="text-xs font-bold text-black/40 uppercase tracking-widest mb-1">Comunicación</p>
        <h1 className="text-3xl font-serif font-black tracking-tight">Mensajes</h1>
      </div>
      <ConversationList conversations={conversations} currentUserId={session.user.id} />
    </div>
  )
}
