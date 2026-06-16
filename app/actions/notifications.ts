"use server"

import { db } from "../../lib/db"
import { getSessionPayload } from "../../lib/auth"
import { revalidatePath } from "next/cache"

export async function markAllAsRead() {
  const session = await getSessionPayload()
  if (!session) return

  try {
    await db.notification.updateMany({
      where: {
        userId: session.userId,
        read: false,
      },
      data: { read: true },
    })

    revalidatePath("/patient/notifications")
  } catch (error) {
    console.error("Error marking notifications as read:", error)
  }
}

export async function getUnreadCount() {
  const session = await getSessionPayload()
  if (!session) return 0

  try {
    const count = await db.notification.count({
      where: {
        userId: session.userId,
        read: false,
      },
    })
    return count
  } catch (error) {
    console.error("Error fetching unread count:", error)
    return 0
  }
}
