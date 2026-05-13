// Enhanced Email Automation System with Advanced Triggers
import { getWelcomeEmailTemplate, getInactivityReminderTemplate } from "./emailTemplates";
// Email log entity types

// Mock email sending function (replace with real email service)
const sendEmail = async (params: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) => {
  console.log('Email sent:', { 
    to: params.to, 
    subject: params.subject,
    timestamp: new Date().toISOString()
  });
  // In production, integrate with SendGrid, AWS SES, or similar
  return { success: true, messageId: `msg_${Date.now()}` };
};

export interface UserEmailData {
  id: string;
  email: string;
  username: string;
  signupDate: string;
  lastLoginAt: string;
  loginCount: number;
  isActive: string;
  welcomeEmailSent: string;
  inactivityEmailSent: string;
  lastActivityAt: string;
}

export interface EmailAutomationConfig {
  inactivityThresholdDays: number;
  enableWelcomeEmails: boolean;
  enableInactivityEmails: boolean;
  enableReEngagementEmails: boolean;
}

class EmailAutomationService {
  private config: EmailAutomationConfig = {
    inactivityThresholdDays: 7,
    enableWelcomeEmails: true,
    enableInactivityEmails: true,
    enableReEngagementEmails: true,
  };

  // Configure automation settings
  configure(config: Partial<EmailAutomationConfig>) {
    this.config = { ...this.config, ...config };
  }

  // Send welcome email to new user
  async sendWelcomeEmail(userData: {
    email: string;
    username: string;
    userId: string;
  }) {
    if (!this.config.enableWelcomeEmails) {
      return { success: false, reason: "Welcome emails disabled" };
    }

    try {
      const emailContent = getWelcomeEmailTemplate(userData.username);
      
      const result = await sendEmail({
        to: userData.email,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
      });

      // Log email sent
      await this.logEmail({
        userId: userData.userId,
        emailType: "welcome",
        recipientEmail: userData.email,
        subject: emailContent.subject,
        status: "sent",
        sentAt: new Date().toISOString(),
      });

      return { success: true, type: "welcome", messageId: result.messageId };
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      return { success: false, error: String(error) };
    }
  }

  // Send inactivity reminder email
  async sendInactivityEmail(userData: {
    email: string;
    username: string;
    userId: string;
    daysSinceLastLogin: number;
  }) {
    if (!this.config.enableInactivityEmails) {
      return { success: false, reason: "Inactivity emails disabled" };
    }

    try {
      const emailContent = getInactivityReminderTemplate(
        userData.username,
        userData.daysSinceLastLogin
      );
      
      const result = await sendEmail({
        to: userData.email,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
      });

      // Log email sent
      await this.logEmail({
        userId: userData.userId,
        emailType: "inactivity_reminder",
        recipientEmail: userData.email,
        subject: emailContent.subject,
        status: "sent",
        sentAt: new Date().toISOString(),
      });

      return { success: true, type: "inactivity", messageId: result.messageId };
    } catch (error) {
      console.error("Failed to send inactivity email:", error);
      return { success: false, error: String(error) };
    }
  }

  // Calculate days since last login
  calculateInactiveDays(lastLoginAt: string): number {
    const lastLogin = new Date(lastLoginAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastLogin.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Determine if user should receive inactivity email
  shouldSendInactivityEmail(user: UserEmailData): boolean {
    const inactiveDays = this.calculateInactiveDays(user.lastLoginAt);
    const emailAlreadySent = user.inactivityEmailSent === "true";
    
    return (
      inactiveDays >= this.config.inactivityThresholdDays && 
      !emailAlreadySent &&
      user.welcomeEmailSent === "true" // Only send to users who received welcome
    );
  }

  // Check if user needs welcome email
  shouldSendWelcomeEmail(user: UserEmailData): boolean {
    return user.welcomeEmailSent !== "true";
  }

  // Process automated email triggers for a user
  async processUserTriggers(user: UserEmailData) {
    const actions: Array<{ type: string; result: any }> = [];

    // Check for welcome email
    if (this.shouldSendWelcomeEmail(user)) {
      const result = await this.sendWelcomeEmail({
        email: user.email,
        username: user.username,
        userId: user.id,
      });
      actions.push({ type: "welcome", result });
    }

    // Check for inactivity email
    if (this.shouldSendInactivityEmail(user)) {
      const daysSinceLogin = this.calculateInactiveDays(user.lastLoginAt);
      const result = await this.sendInactivityEmail({
        email: user.email,
        username: user.username,
        userId: user.id,
        daysSinceLastLogin: daysSinceLogin,
      });
      actions.push({ type: "inactivity", result });
    }

    return actions;
  }

  // Create initial login tracking record
  createLoginRecord(user: { email: string; username: string; id: string }) {
    return {
      userId: user.id,
      email: user.email,
      username: user.username,
      lastLoginAt: new Date().toISOString(),
      loginCount: 1,
      signupDate: new Date().toISOString(),
      isActive: "true",
      inactivityEmailSent: "false",
      welcomeEmailSent: "false",
      lastActivityAt: new Date().toISOString(),
    };
  }

  // Update login record on user activity
  updateLoginRecord(existingRecord: UserEmailData) {
    return {
      ...existingRecord,
      lastLoginAt: new Date().toISOString(),
      loginCount: (existingRecord.loginCount || 0) + 1,
      lastActivityAt: new Date().toISOString(),
      isActive: "true",
      inactivityEmailSent: "false", // Reset inactivity flag on login
    };
  }

  // Log email to database
  private async logEmail(emailData: {
    userId: string;
    emailType: string;
    recipientEmail: string;
    subject: string;
    status: string;
    sentAt: string;
  }) {
    // This would integrate with your entity system
    console.log("Email logged:", emailData);
    return { success: true };
  }

  // Get user email statistics
  async getUserEmailStats(userId: string) {
    // This would query your email logs
    return {
      totalSent: 0,
      welcomeSent: false,
      inactivityRemindersSent: 0,
      lastEmailSentAt: null,
    };
  }
}

// Export singleton instance
export const emailAutomationService = new EmailAutomationService();

// Export data points needed for email automation
export const EMAIL_AUTOMATION_DATA_POINTS = {
  user: {
    id: "Unique user identifier",
    email: "User email address",
    username: "Display name for personalization",
    signupDate: "ISO date when user signed up",
  },
  activity: {
    lastLoginAt: "ISO date of most recent login",
    loginCount: "Total number of logins",
    lastActivityAt: "ISO date of any user activity",
    isActive: "Boolean flag for active status",
  },
  emailTracking: {
    welcomeEmailSent: "Boolean flag - has welcome been sent",
    inactivityEmailSent: "Boolean flag - has inactivity reminder been sent",
  },
  automation: {
    inactivityThresholdDays: "Number of days before sending inactivity email (default: 7)",
    enableWelcomeEmails: "Boolean - enable/disable welcome emails",
    enableInactivityEmails: "Boolean - enable/disable inactivity emails",
  },
};
