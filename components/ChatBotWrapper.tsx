import { createClient } from "@/lib/supabase/server"
import ChatBot from "./ChatBot"

export default async function ChatBotWrapper() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single()

    if (profile?.plan !== "premium") return null

    return <ChatBot />
  } catch {
    return null
  }
}
