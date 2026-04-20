import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import LogoutButton from "@/components/LogoutButton"
import AddRevenue from "@/components/AddRevenue"
import { calculateMicro } from "@/lib/calculations"
import StatCard from "@/components/StatCard"
import RevenueList from "@/components/RevenueList"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", user.id)
  .single()

if (!profile) {
  redirect("/onboarding")
}

const { data: revenues } = await supabase
  .from("revenues")
  .select("*")
  .eq("user_id", user.id)

  if (!user) {
    redirect("/login")
  }
const totalRevenue =
  revenues?.reduce((sum, r) => sum + Number(r.amount), 0) || 0

const result = calculateMicro({
  revenue: totalRevenue,
  activityType: profile.activity_type,
  acre: profile.acre,
  versementLiberatoire: profile.versement_liberatoire,
})

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-400">Bienvenue {user.email}</p>

        <div className="mt-6 flex justify-center">
          <LogoutButton />
          <AddRevenue />
            <div className="grid grid-cols-2 gap-4 mt-8">
                <StatCard title="CA" value={`${totalRevenue.toFixed(2)} €`} />
                <StatCard title="Net" value={`${result.net.toFixed(2)} €`} />
                <StatCard title="Charges" value={`${result.charges.toFixed(2)} € (${(result.socialRate * 100).toFixed(1)}%)`}/>
                <StatCard title="Impôt" value={`${result.tax.toFixed(2)} € (${(result.taxRate * 100).toFixed(1)}%)`}/>
            </div>
           <RevenueList revenues={revenues || []} />

        </div>
      </div>
    </main>
  )
}