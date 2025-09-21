"use client";

import { useState } from "react";

export default function TestPage() {
  const [numbers, setNumbers] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function sendSms() {
    setLoading(true);
    try {
      const recipients = numbers.split(",").map((n) => n.trim());

      const res = await fetch(
        `https://api.textbee.dev/api/v1/gateway/devices/${process.env.NEXT_PUBLIC_TEXTBEE_DEVICE_ID}/send-sms`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_TEXTBEE_API_KEY as string,
          },
          body: JSON.stringify({ recipients, message }),
        },
      );

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setResponse({ error: "Failed to send SMS" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-bold">Send SMS (TextBee)</h1>

      <div className="mb-4">
        <label className="block font-medium">Numbers (comma separated):</label>
        <input
          type="text"
          value={numbers}
          onChange={(e) => setNumbers(e.target.value)}
          className="w-full rounded border p-2"
          placeholder="+639123456789, +639876543210"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium">Message:</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded border p-2"
          placeholder="Enter your message..."
        />
      </div>

      <button
        onClick={sendSms}
        disabled={loading}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        {loading ? "Sending..." : "Send SMS"}
      </button>

      {response && (
        <pre className="mt-4 rounded bg-gray-100 p-4 text-sm">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}
