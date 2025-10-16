import sgMail from '@sendgrid/mail'

// Initialize SendGrid with API key if available
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export interface EmailData {
  to: string
  subject: string
  text?: string
  html?: string
}

export async function sendEmail(data: EmailData): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SendGrid API key not configured, email not sent')
    return false
  }

  try {
    await sgMail.send({
      to: data.to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'notifications@minnesota.ceo',
        name: process.env.SENDGRID_FROM_NAME || 'MINNESOTA.CEO',
      },
      subject: data.subject,
      text: data.text || '',
      html: data.html || '',
    })
    return true
  } catch (error) {
    console.error('SendGrid error:', error)
    return false
  }
}

export async function sendWelcomeEmail(email: string): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #000; color: #fff; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; }
          .title { font-size: 32px; color: #FFD700; margin-bottom: 10px; }
          .content { font-size: 16px; line-height: 1.6; }
          .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
          .button { display: inline-block; padding: 12px 30px; background: #FFD700; color: #000; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="title">MINNESOTA.CEO</div>
            <p>Interviewing Minnesota Leaders</p>
          </div>
          <div class="content">
            <p>Thank you for joining our waitlist!</p>
            <p>We're excited to have you as part of our community. MINNESOTA.CEO will launch on November 1st, 2025, featuring exclusive video interviews with Minnesota's most influential leaders.</p>
            <p>You'll be the first to know when we go live and get exclusive early access to our content.</p>
            <p>Stay tuned for updates!</p>
            <div style="text-align: center;">
              <a href="https://minnesota.ceo" class="button">Visit Our Site</a>
            </div>
          </div>
          <div class="footer">
            <p>© 2025 EVERJUST COMPANY. All rights reserved.</p>
            <p>company@everjust.org</p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: 'Welcome to MINNESOTA.CEO - You\'re on the List!',
    text: 'Thank you for joining our waitlist! We\'ll notify you when MINNESOTA.CEO launches on November 1st, 2025.',
    html,
  })
}

export async function sendNominationConfirmation(email: string, nomineeName: string): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #000; color: #fff; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; }
          .title { font-size: 32px; color: #FFD700; margin-bottom: 10px; }
          .content { font-size: 16px; line-height: 1.6; }
          .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="title">MINNESOTA.CEO</div>
            <p>Leader Nomination Received</p>
          </div>
          <div class="content">
            <p>Thank you for nominating <strong>${nomineeName}</strong> to be featured on MINNESOTA.CEO!</p>
            <p>We appreciate your contribution to highlighting Minnesota's exceptional leaders. Our team will review your nomination and consider it for our upcoming interview series.</p>
            <p>We'll keep you updated on the progress of your nomination.</p>
          </div>
          <div class="footer">
            <p>© 2025 EVERJUST COMPANY. All rights reserved.</p>
            <p>company@everjust.org</p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `MINNESOTA.CEO - Nomination for ${nomineeName} Received`,
    text: `Thank you for nominating ${nomineeName} to be featured on MINNESOTA.CEO! We'll review your nomination and keep you updated.`,
    html,
  })
}
