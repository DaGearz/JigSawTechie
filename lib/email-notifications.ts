// Email notification system for threaded messaging
// This is a placeholder implementation - you'll need to integrate with your email service

interface EmailNotificationData {
  to: string;
  toName: string;
  from: string;
  fromName: string;
  subject: string;
  message: string;
  threadId: string;
  isReply: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

interface EmailService {
  sendEmail(data: EmailNotificationData): Promise<boolean>;
}

// Mock email service - replace with your actual email provider
class MockEmailService implements EmailService {
  async sendEmail(data: EmailNotificationData): Promise<boolean> {
    console.log('📧 Email Notification (Mock):', {
      to: `${data.toName} <${data.to}>`,
      from: `${data.fromName} <${data.from}>`,
      subject: data.isReply ? `Re: ${data.subject}` : `New Message: ${data.subject}`,
      priority: data.priority,
      threadId: data.threadId,
    });
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock success (in production, this would be actual email sending)
    return true;
  }
}

// Resend email service implementation (uncomment when ready to use)
/*
class ResendEmailService implements EmailService {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async sendEmail(data: EmailNotificationData): Promise<boolean> {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${data.fromName} <noreply@jigsawtechie.com>`,
          to: [`${data.toName} <${data.to}>`],
          subject: data.isReply ? `Re: ${data.subject}` : `New Message: ${data.subject}`,
          html: this.generateEmailHTML(data),
        }),
      });
      
      return response.ok;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }
  
  private generateEmailHTML(data: EmailNotificationData): string {
    const priorityColor = {
      low: '#6B7280',
      normal: '#3B82F6',
      high: '#F59E0B',
      urgent: '#EF4444'
    }[data.priority];
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${data.isReply ? 'Reply' : 'New Message'} from ${data.fromName}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #1f2937; margin: 0 0 10px 0;">
              ${data.isReply ? '💬 New Reply' : '📧 New Message'}
            </h2>
            <p style="margin: 0; color: #6b7280;">
              You have a ${data.isReply ? 'reply' : 'new message'} from ${data.fromName}
            </p>
          </div>
          
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 15px; margin-bottom: 15px;">
              <h3 style="margin: 0 0 5px 0; color: #1f2937;">${data.subject}</h3>
              <div style="display: flex; align-items: center; gap: 10px; font-size: 14px; color: #6b7280;">
                <span>From: ${data.fromName}</span>
                <span style="background: ${priorityColor}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                  ${data.priority.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div style="white-space: pre-wrap; line-height: 1.6;">
              ${data.message}
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://jigsawtechie.com/admin#messages" 
               style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
              View & Reply in Dashboard
            </a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
            <p>This is an automated notification from Jigsaw Techie.</p>
            <p>
              <a href="https://jigsawtechie.com" style="color: #3b82f6; text-decoration: none;">
                Jigsaw Techie - Solving your digital puzzle
              </a>
            </p>
          </div>
        </body>
      </html>
    `;
  }
}
*/

// SendGrid email service implementation (alternative)
/*
class SendGridEmailService implements EmailService {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async sendEmail(data: EmailNotificationData): Promise<boolean> {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: data.to, name: data.toName }],
            subject: data.isReply ? `Re: ${data.subject}` : `New Message: ${data.subject}`,
          }],
          from: { email: 'noreply@jigsawtechie.com', name: 'Jigsaw Techie' },
          content: [{
            type: 'text/html',
            value: this.generateEmailHTML(data),
          }],
        }),
      });
      
      return response.ok;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }
  
  private generateEmailHTML(data: EmailNotificationData): string {
    // Same HTML template as Resend
    return '...'; // Implementation same as above
  }
}
*/

// Email notification service
export class EmailNotificationService {
  private emailService: EmailService;
  
  constructor() {
    // Initialize with mock service by default
    // In production, replace with actual email service:
    // this.emailService = new ResendEmailService(process.env.RESEND_API_KEY!);
    // or
    // this.emailService = new SendGridEmailService(process.env.SENDGRID_API_KEY!);
    this.emailService = new MockEmailService();
  }
  
  async notifyNewMessage(data: EmailNotificationData): Promise<boolean> {
    try {
      return await this.emailService.sendEmail(data);
    } catch (error) {
      console.error('Failed to send email notification:', error);
      return false;
    }
  }
}

// Singleton instance
export const emailNotificationService = new EmailNotificationService();

// Helper function to send notification for new messages
export async function sendMessageNotification(
  recipientEmail: string,
  recipientName: string,
  senderEmail: string,
  senderName: string,
  subject: string,
  message: string,
  threadId: string,
  isReply: boolean = false,
  priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal'
): Promise<boolean> {
  return await emailNotificationService.notifyNewMessage({
    to: recipientEmail,
    toName: recipientName,
    from: senderEmail,
    fromName: senderName,
    subject,
    message,
    threadId,
    isReply,
    priority,
  });
}
