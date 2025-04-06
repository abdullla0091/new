export async function removeChat(chatId: string) {
  // ... existing code ...
}

export async function clearAllChats() {
  try {
    const chats = await db.chat.findMany()
    
    // Delete all chats in parallel
    await Promise.all(
      chats.map(chat => 
        db.chat.delete({
          where: {
            id: chat.id
          }
        })
      )
    )
    
    return { success: true }
  } catch (error) {
    console.error("Failed to clear chat history:", error)
    return { error: "Failed to clear chat history" }
  }
} 