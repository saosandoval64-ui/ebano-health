import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { getMessages } from "@/app/actions/messages"
import ChatWindow from "./ChatWindow"

export default async function ConversationPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return redirect("/login")

  // Verificar pertenencia
  const participation = await db.conversationParticipant.findUnique({
    where: {
      conversationId_userId: {
        conversationId: params.id,
        userId: session.user.id,
      },
    },
    include: {
      conversation: {
        include: {
          participants: {
            include: {
              user: {
                select: { id: true, name: true, lastName: true, avatar: true, role: true },
              },
            },
          },
        },
      },
    },
  })

  if (!participation) return redirect("/mensajes")

  const messages = await getMessages(params.id)

  const otherParticipant = participation.conversation.participants
    .find((p) => p.userId !== session.user.id)?.user ?? null

  return (
    <ChatWindow
      conversationId={params.id}
      currentUserId={session.user.id}
      initialMessages={messages}
      otherUser={otherParticipant}
    />
  )
}
