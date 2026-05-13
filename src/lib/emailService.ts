import { getEmailTemplate } from "./emailTemplates";

type SendEmailParams = {
  recipientEmail: string;
  recipientUserId?: number;
  templateType: "welcome" | "scenarioUpdate" | "calculationSummary" | "featureAnnouncement" | "weeklyDigest";
  templateData: {
    userName?: string;
    scenarioName?: string;
    scenarioDetails?: string;
    calculationResults?: string;
    featureName?: string;
    featureDescription?: string;
    unsubscribeUrl?: string;
  };
};

export const emailService = {
  async sendEmail(params: SendEmailParams): Promise<{ success: boolean; error?: string }> {
    const { recipientEmail, templateType, templateData } = params;

    try {
      // Get the email template
      const template = getEmailTemplate(templateType, templateData);

      // In a real implementation, you would integrate with an email service provider like:
      // - SendGrid
      // - Mailgun
      // - AWS SES
      // - Postmark
      // - Resend
      
      // Simulate email sending
      console.log("📧 Email would be sent:", {
        to: recipientEmail,
        subject: template.subject,
        html: template.html,
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Failed to send email:", error);
      return { success: false, error: errorMessage };
    }
  },

  async sendWelcomeEmail(email: string, name?: string): Promise<void> {
    await this.sendEmail({
      recipientEmail: email,
      templateType: "welcome",
      templateData: {
        userName: name,
        unsubscribeUrl: `https://liftmetric.com/unsubscribe?email=${encodeURIComponent(email)}`,
      },
    });
  },

  async sendScenarioUpdateEmail(email: string, scenarioName: string, details?: string): Promise<void> {
    await this.sendEmail({
      recipientEmail: email,
      templateType: "scenarioUpdate",
      templateData: {
        scenarioName,
        scenarioDetails: details,
        unsubscribeUrl: `https://liftmetric.com/unsubscribe?email=${encodeURIComponent(email)}`,
      },
    });
  },

  async sendCalculationSummaryEmail(email: string, results: string): Promise<void> {
    await this.sendEmail({
      recipientEmail: email,
      templateType: "calculationSummary",
      templateData: {
        calculationResults: results,
        unsubscribeUrl: `https://liftmetric.com/unsubscribe?email=${encodeURIComponent(email)}`,
      },
    });
  },

  async sendFeatureAnnouncementEmail(email: string, featureName: string, description: string): Promise<void> {
    await this.sendEmail({
      recipientEmail: email,
      templateType: "featureAnnouncement",
      templateData: {
        featureName,
        featureDescription: description,
        unsubscribeUrl: `https://liftmetric.com/unsubscribe?email=${encodeURIComponent(email)}`,
      },
    });
  },

  async sendWeeklyDigestEmail(email: string, userName?: string): Promise<void> {
    await this.sendEmail({
      recipientEmail: email,
      templateType: "weeklyDigest",
      templateData: {
        userName,
        unsubscribeUrl: `https://liftmetric.com/unsubscribe?email=${encodeURIComponent(email)}`,
      },
    });
  },
};
