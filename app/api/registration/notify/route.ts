import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email, businessName, founder, status } = await req.json()

    if (!email || !businessName) {
      return NextResponse.json(
        { error: "email and businessName are required" },
        { status: 400 }
      )
    }

    const apiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.APP_FROM_EMAIL || "onboarding@resend.dev"

    // In Resend's test mode, you can only send to your own email.
    // Allow overriding the actual recipient with RESEND_TEST_EMAIL during development.
    const toEmail = process.env.RESEND_TEST_EMAIL || email

    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured")
      return NextResponse.json(
        { error: "Email service not configured on server" },
        { status: 500 }
      )
    }

    const isApproved = status === "approved"
    const subject = isApproved
      ? "Your student business has been approved"
      : "Update on your student business registration"

    const bodyHtml = isApproved
      ? `
          <p>Hi ${founder || "there"},</p>
          <p>Great news! Your student business <strong>${businessName}</strong> has been approved by the Ashesi Entrepreneurship Committee and is now listed on the Ashesi businesses platform.</p>
          <p><em>(Original registration email: ${email})</em></p>
          <p>You can visit the site to see your listing and share it with others.</p>
          <p>Best,<br/>Ashesi Entrepreneurship Committee</p>
        `
      : `
          <p>Hi ${founder || "there"},</p>
          <p>Thank you for registering your student business <strong>${businessName}</strong> with the Ashesi Entrepreneurship Committee.</p>
          <p>After careful review, your application was <strong>not approved</strong> at this time.</p>
          <p>We encourage you to keep refining your idea and you are welcome to re-apply in the future.</p>
          <p><em>(Original registration email: ${email})</em></p>
          <p>Best,<br/>Ashesi Entrepreneurship Committee</p>
        `

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Ashesi Business Desk <${fromEmail}>`,
        to: [toEmail],
        subject,
        html: bodyHtml,
      }),
    })

    if (!response.ok) {
      const text = await response.text()
      console.error("Failed to send email via Resend:", text)
      return NextResponse.json(
        { error: "Failed to send approval email" },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error in approval email endpoint:", error)
    return NextResponse.json(
      { error: "Unexpected error sending email" },
      { status: 500 }
    )
  }
}


