"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

// Obtener todas las conversaciones del usuario actual con último mensaje
export async function getConversations() {
  const session = await auth()
  if (!session?.user) return []

  const participations = await db.conversationParticipant.findMany({
    where: { userId: session.user.id },
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
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
    },
    orderBy: { conversation: { updatedAt: "desc" } },
  })

  return participations.map((p) => ({
    id: p.conversation.id,
    lastMessage: p.conversation.messages[0] ?? null,
    updatedAt: p.conversation.updatedAt,
    participants: p.conversation.participants
      .filter((cp) => cp.userId !== session.user.id)
      .map((cp) => cp.user),
    unreadCount: 0, // se puede calcular con count si se necesita
  }))
}

// Obtener mensajes de una conversación (verificando que el usuario pertenezca)
export async function getMessages(conversationId: string) {
  const session = await auth()
  if (!session?.user) return []

  const participation = await db.conversationParticipant.findUnique({
    where: {
      conversationId_userId: {
        conversationId,
        userId: session.user.id,
      },
    },
  })
  if (!participation) return []

  // Marcar como leídos los mensajes de otros
  await db.message.updateMany({
    where: {
      conversationId,
      read: false,
      senderId: { not: session.user.id },
    },
    data: { read: true },
  })

  return db.message.findMany({
    where: { conversationId },
    include: {
      sender: {
        select: { id: true, name: true, lastName: true, avatar: true },
      },
    },
    orderBy: { createdAt: "asc" },
  })
}

// Enviar un mensaje
export async function sendMessage(conversationId: string, body: string) {
  const session = await auth()
  if (!session?.user) return { success: false, message: "No autorizado" }

  if (!body.trim()) return { success: false, message: "El mensaje no puede estar vacío" }
  if (body.length > 2000) return { success: false, message: "Mensaje demasiado largo (máx. 2000 caracteres)" }

  const participation = await db.conversationParticipant.findUnique({
    where: {
      conversationId_userId: {
        conversationId,
        userId: session.user.id,
      },
    },
  })
  if (!participation) return { success: false, message: "No pertenecés a esta conversación" }

  try {
    const msg = await db.message.create({
      data: {
        conversationId,
        senderId: session.user.id,
        body: body.trim(),
      },
      include: {
        sender: { select: { id: true, name: true, lastName: true, avatar: true } },
      },
    })

    // Actualizar updatedAt de la conversación
    await db.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    })

    revalidatePath("/mensajes")
    return { success: true, message: msg }
  } catch (error) {
    console.error("[sendMessage]", error)
    return { success: false, message: "Error al enviar el mensaje" }
  }
}

// Iniciar o recuperar conversación con otro usuario
export async function getOrCreateConversation(otherUserId: string) {
  const session = await auth()
  if (!session?.user) return { success: false, conversationId: null }
  if (otherUserId === session.user.id) return { success: false, conversationId: null }

  // Verificar que el otro usuario existe
  const other = await db.user.findUnique({
    where: { id: otherUserId },
    select: { id: true },
  })
  if (!other) return { success: false, conversationId: null }

  // Buscar conversación 1:1 ya existente entre ambos
  const existing = await db.conversationParticipant.findFirst({
    where: {
      userId: session.user.id,
      conversation: {
        participants: {
          some: { userId: otherUserId },
        },
      },
    },
    select: { conversationId: true },
  })

  if (existing) {
    return { success: true, conversationId: existing.conversationId }
  }

  // Crear nueva conversación
  const conversation = await db.conversation.create({
    data: {
      participants: {
        create: [{ userId: session.user.id }, { userId: otherUserId }],
      },
    },
  })

  revalidatePath("/mensajes")
  return { success: true, conversationId: conversation.id }
}

// Contar mensajes no leídos del usuario actual (para badge en sidebar)
export async function getUnreadMessagesCount() {
  const session = await auth()
  if (!session?.user) return 0

  const participations = await db.conversationParticipant.findMany({
    where: { userId: session.user.id },
    select: { conversationId: true },
  })
  const conversationIds = participations.map((p) => p.conversationId)
  if (conversationIds.length === 0) return 0

  return db.message.count({
    where: {
      conversationId: { in: conversationIds },
      senderId: { not: session.user.id },
      read: false,
    },
  })
}
