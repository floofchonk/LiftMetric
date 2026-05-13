import { emailService } from "./emailService";
import { getWelcomeEmailTemplate, getInactivityReminderTemplate } from "./emailTemplates";

export const emailAutomation = {
  // Send welcome email to new users
  async sendWelcomeEmail(userData: {
    email: string;
    username: string;
    userId: string;
  }) {
    try {
      const emailContent = getWelcomeEmailTemplate(userData.username);
      
      await emailService.sendEmail({
        recipientEmail: userData.email,
        templateType: "welcome",
        templateData: {
          userName: userData.username,
        },
      });

      return { success: true, type: "welcome" };
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      return { success: false, error: String(error) };
    }
  },

  // Send inactivity reminder email
  async sendInactivityEmail(userData: {
    email: string;
    username: string;
    userId: string;
    daysSinceLastLogin: number;
  }) {
    try {
      const emailContent = getInactivityReminderTemplate(
        userData.username,
        userData.daysSinceLastLogin
      );
      
      await emailService.sendEmail({
        recipientEmail: userData.email,
        templateType: "weeklyDigest",
        templateData: {
          userName: userData.username,
        },
      });

      return { success: true, type: "inactivity" };
    } catch (error) {
      console.error("Failed to send inactivity email:", error);
      return { success: false, error: String(error) };
    }
  },

  // Check and trigger automated emails based on user activity
  async checkAndTriggerEmails(users: Array<{
    id: string;
    email: string;
    name: string;
    lastLoginAt?: string;
    createdAt: string;
  }>) {
    const results: Array<{ userId: string; type: string; success: boolean }> = [];
    const now = new Date();

    for (const user of users) {
      // Check for inactivity (7+ days since last login)
      if (user.lastLoginAt) {
        const lastLogin = new Date(user.lastLoginAt);
        const daysSinceLastLogin = Math.floor(
          (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceLastLogin >= 7) {
          const result = await this.sendInactivityEmail({
            email: user.email,
            username: user.name || "User",
            userId: user.id,
            daysSinceLastLogin,
          });
          results.push({ userId: user.id, type: "inactivity", success: result.success });
        }
      }
    }

    return results;
  },
};

export default emailAutomation;
