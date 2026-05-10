import { redirect } from "next/navigation"

// Les CGU/CGV complètes sont à /legal/terms
export default function CGVRedirect() {
  redirect("/legal/terms")
}
