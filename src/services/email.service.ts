import { PlanType } from '@prisma/client';

export class EmailService {
  private apiKey = process.env.RESEND_API_KEY;
  private fromEmail = process.env.FROM_EMAIL || 'CareerOS <noreply@careeros.dev>';

  private async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    if (!this.apiKey || this.apiKey === 'placeholder_key') {
      console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
      console.log(`[MOCK EMAIL CONTENT]:\n${html}\n-----------------------------------`);
      return true;
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          from: this.fromEmail,
          to: [to],
          subject,
          html,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error('Failed to send email via Resend:', errData);
        return false;
      }

      console.log(`Email successfully sent to ${to} via Resend. Subject: "${subject}"`);
      return true;
    } catch (error) {
      console.error('Error sending email via Resend:', error);
      return false;
    }
  }

  async sendWelcomeEmail(to: string, userName: string): Promise<boolean> {
    const subject = 'Welcome to CareerOS!';
    const html = `
      <h1>Welcome, ${userName}!</h1>
      <p>Thank you for choosing CareerOS as your job application companion.</p>
      <p>You have been automatically enrolled in the <strong>FREE</strong> plan, giving you access to application tracking, resume management, and reminders.</p>
      <p>Start organizing your placement journey today!</p>
      <br/>
      <p>Best regards,<br/>The CareerOS Team</p>
    `;
    return this.sendEmail(to, subject, html);
  }

  async sendUpgradeEmail(to: string, userName: string, plan: PlanType, billingCycle: string, amount: number): Promise<boolean> {
    const subject = `Your CareerOS ${plan} Subscription is Active!`;
    const html = `
      <h1>Congratulations, ${userName}!</h1>
      <p>Your subscription has been successfully upgraded to the <strong>${plan}</strong> plan.</p>
      <p><strong>Plan details:</strong></p>
      <ul>
        <li>Plan: ${plan}</li>
        <li>Billing Cycle: ${billingCycle}</li>
        <li>Amount Paid: ₹${amount}</li>
      </ul>
      <p>Your new limits and premium features are active immediately.</p>
      <br/>
      <p>Thank you for supporting CareerOS!</p>
    `;
    return this.sendEmail(to, subject, html);
  }

  async sendDowngradeEmail(to: string, userName: string, plan: PlanType): Promise<boolean> {
    const subject = 'CareerOS Subscription Updated';
    const html = `
      <h1>Hello ${userName},</h1>
      <p>Your subscription plan has been downgraded to <strong>${plan}</strong>.</p>
      <p>Your existing job applications and resumes remain safe in your dashboard, but new resource creations will be restricted to the limits of the ${plan} plan.</p>
      <p>If this was a mistake, you can upgrade your plan again at any time.</p>
      <br/>
      <p>Best regards,<br/>The CareerOS Team</p>
    `;
    return this.sendEmail(to, subject, html);
  }

  async sendPaymentSuccessEmail(to: string, userName: string, invoiceNumber: string, amount: number): Promise<boolean> {
    const subject = 'Payment Successful - CareerOS Invoice';
    const html = `
      <h1>Payment Receipt</h1>
      <p>Hello ${userName},</p>
      <p>Your payment of ₹${amount} has been successfully processed.</p>
      <p><strong>Invoice details:</strong></p>
      <ul>
        <li>Invoice ID: ${invoiceNumber}</li>
        <li>Amount: ₹${amount}</li>
        <li>Status: Paid</li>
      </ul>
      <br/>
      <p>Thank you for choosing CareerOS!</p>
    `;
    return this.sendEmail(to, subject, html);
  }

  async sendPaymentFailedEmail(to: string, userName: string, amount: number, errorReason: string): Promise<boolean> {
    const subject = 'Payment Failed - Action Required';
    const html = `
      <h1>Payment Attempt Failed</h1>
      <p>Hello ${userName},</p>
      <p>We were unable to process your payment of ₹${amount}.</p>
      <p><strong>Reason:</strong> ${errorReason || 'Transaction declined'}</p>
      <p>Please update your billing details and try again to avoid service interruption.</p>
      <br/>
      <p>Best regards,<br/>The CareerOS Team</p>
    `;
    return this.sendEmail(to, subject, html);
  }

  async sendStorageLimitReachedEmail(to: string, userName: string, usedBytes: number, limitBytes: number): Promise<boolean> {
    const usedMB = (usedBytes / (1024 * 1024)).toFixed(1);
    const limitMB = (limitBytes / (1024 * 1024)).toFixed(1);
    const subject = 'Action Required: Storage Limit Reached';
    const html = `
      <h1>Storage Limit Reached</h1>
      <p>Hello ${userName},</p>
      <p>You have reached your plan's storage limit. You are currently using ${usedMB} MB of your allowed ${limitMB} MB limit.</p>
      <p>Please upgrade your plan or delete older resumes to restore upload capabilities.</p>
      <br/>
      <p>Best regards,<br/>The CareerOS Team</p>
    `;
    return this.sendEmail(to, subject, html);
  }

  async sendUsageLimitReachedEmail(to: string, userName: string, resourceName: string, currentCount: number): Promise<boolean> {
    const subject = `Action Required: ${resourceName} Limit Reached`;
    const html = `
      <h1>Resource Limit Reached</h1>
      <p>Hello ${userName},</p>
      <p>You have reached the maximum allowed limit for <strong>${resourceName}</strong> (${currentCount}/${currentCount}) on your plan.</p>
      <p>To continue creating more ${resourceName.toLowerCase()}, please upgrade your plan.</p>
      <br/>
      <p>Best regards,<br/>The CareerOS Team</p>
    `;
    return this.sendEmail(to, subject, html);
  }
}

export default new EmailService();
