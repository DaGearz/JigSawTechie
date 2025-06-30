import { Quote } from './supabase'

// Simple email notification using a webhook service
// You can replace this with your preferred email service

export async function sendQuoteNotification(quote: Quote) {
  // For now, we'll just log the quote
  // Later you can integrate with:
  // - Resend (recommended)
  // - SendGrid
  // - EmailJS
  // - Or any other email service

  console.log('New quote received:', {
    id: quote.id,
    name: quote.name,
    email: quote.email,
    company: quote.company,
    project_type: quote.project_type,
    budget: quote.budget,
    timeline: quote.timeline,
    created_at: quote.created_at
  })

  // TODO: Replace with actual email service
  // Example with Resend:
  /*
  try {
    await resend.emails.send({
      from: 'quotes@jigsawtechie.com',
      to: 'twilliams@jigsawtechie.com',
      subject: `New Quote Request from ${quote.name}`,
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Name:</strong> ${quote.name}</p>
        <p><strong>Email:</strong> ${quote.email}</p>
        <p><strong>Company:</strong> ${quote.company || 'N/A'}</p>
        <p><strong>Project Type:</strong> ${quote.project_type}</p>
        <p><strong>Budget:</strong> ${quote.budget}</p>
        <p><strong>Timeline:</strong> ${quote.timeline}</p>
        <p><strong>Description:</strong></p>
        <p>${quote.description}</p>
        <p><strong>Features:</strong> ${quote.features.join(', ')}</p>
        <p><strong>Submitted:</strong> ${new Date(quote.created_at).toLocaleString()}</p>
      `
    })
  } catch (error) {
    console.error('Failed to send email notification:', error)
  }
  */
}

// Email template for quote notifications
export function generateQuoteEmailHTML(quote: Quote): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Quote Request - Jigsaw Techie</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #2563eb; }
        .value { margin-top: 5px; }
        .features { display: flex; flex-wrap: wrap; gap: 10px; }
        .feature-tag { background: #e5e7eb; padding: 5px 10px; border-radius: 15px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 New Quote Request</h1>
          <p>Jigsaw Techie - Quote #${quote.id.slice(0, 8)}</p>
        </div>
        
        <div class="content">
          <div class="field">
            <div class="label">👤 Contact Information</div>
            <div class="value">
              <strong>${quote.name}</strong><br>
              📧 ${quote.email}<br>
              ${quote.phone ? `📞 ${quote.phone}<br>` : ''}
              ${quote.company ? `🏢 ${quote.company}<br>` : ''}
              ${quote.website ? `🌐 ${quote.website}` : ''}
            </div>
          </div>

          <div class="field">
            <div class="label">📋 Project Details</div>
            <div class="value">
              <strong>Type:</strong> ${quote.project_type}<br>
              <strong>Budget:</strong> ${quote.budget}<br>
              <strong>Timeline:</strong> ${quote.timeline}
            </div>
          </div>

          <div class="field">
            <div class="label">📝 Description</div>
            <div class="value">${quote.description}</div>
          </div>

          ${quote.features.length > 0 ? `
          <div class="field">
            <div class="label">⚡ Requested Features</div>
            <div class="features">
              ${quote.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
            </div>
          </div>
          ` : ''}

          <div class="field">
            <div class="label">📅 Submitted</div>
            <div class="value">${new Date(quote.created_at).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}
