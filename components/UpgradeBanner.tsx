import { createClient } from "@/lib/supabase/server"
import UpgradeBannerClient from "./UpgradeBannerClient"

export default async function UpgradeBanner() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, founder_number")
    .eq("id", user.id)
    .single()

  if (!profile) return null

  const isPremium = profile.plan === "premium"
  if (isPremium) return null

  return <UpgradeBannerClient />
}
