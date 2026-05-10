import { redirect } from "next/navigation"

// La politique de confidentialité complète est à /legal/privacy
export default function ConfidentialiteRedirect() {
  redirect("/legal/privacy")
}
