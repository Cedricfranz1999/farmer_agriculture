"use server";

import { sendVerifyEmail } from "~/lib/mail";

export async function sendVerifyEmailAction(
  to: string,
  status: string,
  name: string,
) {
  return await sendVerifyEmail(to, status, name);
}
