import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY)

export const FROM_EMAIL = "KeskiReste <noreply@keskireste.fr>"
export const REPLY_TO = "contact@keskireste.fr"
