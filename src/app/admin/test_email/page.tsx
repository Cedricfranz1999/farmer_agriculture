"use client";

import React from "react";
import { sendVerifyEmailAction } from "../test/actions";

const Page = () => {
  const handleSendEmail = async () => {
    try {
      await sendVerifyEmailAction("cedriccandido451@gmail.com");
      alert("Verification email sent!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email.");
    }
  };

  return (
    <div>
      <h1>Test Email</h1>
      <button onClick={handleSendEmail}>Send Verification Email</button>
    </div>
  );
};

export default Page;
