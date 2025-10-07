"use server";

import { sendVerifyEmail } from "~/lib/mail";

export async function sendVerifyEmailAction(
  to: string,
  status: string,
  name: string,
  rejectionMessage: string  | null,
) {
  return await sendVerifyEmail(to, status, name);
}
