type EmailTemplate = {
  subject: string;
  html: string;
  text: string;
};

type TemplateData = {
  userName?: string;
  scenarioName?: string;
  scenarioDetails?: string;
  calculationResults?: string;
  featureName?: string;
  featureDescription?: string;
  unsubscribeUrl?: string;
};

export const emailTemplates = {
  welcome: (data: TemplateData): EmailTemplate => ({
    subject: "Welcome to Lift Metric!",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Lift Metric!</h1>
            </div>
            <div class="content">
              <p>Hi ${data.userName || 'there'},</p>
              <p>Thank you for joining Lift Metric! We're excited to help you make data-driven decisions with powerful ROI calculations.</p>
              <p>Here's what you can do:</p>
              <ul>
                <li>Calculate ROI with multiple modes (Basic, Advanced, Custom)</li>
                <li>Save and compare scenarios</li>
                <li>Access advanced analytics and insights</li>
                <li>Export detailed reports</li>
              </ul>
              <a href="https://liftmetric.com" class="button">Get Started</a>
              <p>If you have any questions, feel free to reach out to our support team.</p>
              <p>Best regards,<br>The Lift Metric Team</p>
            </div>
            <div class="footer">
              <p>You're receiving this email because you subscribed to Lift Metric.</p>
              ${data.unsubscribeUrl ? `<p><a href="${data.unsubscribeUrl}">Unsubscribe</a></p>` : ''}
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Welcome to Lift Metric!\n\nHi ${data.userName || 'there'},\n\nThank you for joining Lift Metric! We're excited to help you make data-driven decisions.\n\nBest regards,\nThe Lift Metric Team`,
  }),

  scenarioUpdate: (data: TemplateData): EmailTemplate => ({
    subject: `Scenario Updated: ${data.scenarioName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px; }
            .scenario-box { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📊 Scenario Updated</h2>
            </div>
            <div class="content">
              <p>Hi ${data.userName || 'there'},</p>
              <p>Your saved scenario has been updated:</p>
              <div class="scenario-box">
                <h3>${data.scenarioName}</h3>
                ${data.scenarioDetails || ''}
              </div>
              <a href="https://liftmetric.com" class="button">View Scenario</a>
              <p>Best regards,<br>The Lift Metric Team</p>
            </div>
            <div class="footer">
              ${data.unsubscribeUrl ? `<p><a href="${data.unsubscribeUrl}">Unsubscribe</a></p>` : ''}
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Scenario Updated: ${data.scenarioName}\n\nHi ${data.userName || 'there'},\n\nYour saved scenario has been updated.\n\nBest regards,\nThe Lift Metric Team`,
  }),

  calculationSummary: (data: TemplateData): EmailTemplate => ({
    subject: "Your ROI Calculation Summary",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px; }
            .results-box { background: #f0f7ff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>✅ Calculation Complete</h2>
            </div>
            <div class="content">
              <p>Hi ${data.userName || 'there'},</p>
              <p>Your ROI calculation has been completed. Here's a summary:</p>
              <div class="results-box">
                ${data.calculationResults || '<p>Results are available in your dashboard.</p>'}
              </div>
              <a href="https://liftmetric.com" class="button">View Full Report</a>
              <p>Best regards,<br>The Lift Metric Team</p>
            </div>
            <div class="footer">
              ${data.unsubscribeUrl ? `<p><a href="${data.unsubscribeUrl}">Unsubscribe</a></p>` : ''}
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Your ROI Calculation Summary\n\nHi ${data.userName || 'there'},\n\nYour ROI calculation has been completed. Visit Lift Metric to view the full report.\n\nBest regards,\nThe Lift Metric Team`,
  }),

  featureAnnouncement: (data: TemplateData): EmailTemplate => ({
    subject: `New Feature: ${data.featureName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px; }
            .feature-box { background: #ecfdf5; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #10b981; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 New Feature Available!</h1>
            </div>
            <div class="content">
              <p>Hi ${data.userName || 'there'},</p>
              <p>We're excited to announce a new feature in Lift Metric:</p>
              <div class="feature-box">
                <h3>${data.featureName}</h3>
                <p>${data.featureDescription || ''}</p>
              </div>
              <a href="https://liftmetric.com" class="button">Try It Now</a>
              <p>As always, we're committed to helping you make better data-driven decisions.</p>
              <p>Best regards,<br>The Lift Metric Team</p>
            </div>
            <div class="footer">
              ${data.unsubscribeUrl ? `<p><a href="${data.unsubscribeUrl}">Unsubscribe</a></p>` : ''}
            </div>
          </div>
        </body>
      </html>
    `,
    text: `New Feature: ${data.featureName}\n\nHi ${data.userName || 'there'},\n\n${data.featureDescription || ''}\n\nTry it now at Lift Metric!\n\nBest regards,\nThe Lift Metric Team`,
  }),

  weeklyDigest: (data: TemplateData): EmailTemplate => ({
    subject: "Your Weekly Lift Metric Digest",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px; }
            .stat-box { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📈 Your Weekly Digest</h2>
            </div>
            <div class="content">
              <p>Hi ${data.userName || 'there'},</p>
              <p>Here's your weekly summary from Lift Metric:</p>
              <div class="stat-box">
                <p><strong>This Week:</strong></p>
                <ul>
                  <li>Calculations performed</li>
                  <li>Scenarios saved</li>
                  <li>Time saved with Lift Metric</li>
                </ul>
              </div>
              <a href="https://liftmetric.com" class="button">View Dashboard</a>
              <p>Keep up the great work!</p>
              <p>Best regards,<br>The Lift Metric Team</p>
            </div>
            <div class="footer">
              ${data.unsubscribeUrl ? `<p><a href="${data.unsubscribeUrl}">Unsubscribe</a></p>` : ''}
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Your Weekly Lift Metric Digest\n\nHi ${data.userName || 'there'},\n\nHere's your weekly summary from Lift Metric.\n\nBest regards,\nThe Lift Metric Team`,
  }),
};

export const getEmailTemplate = (
  templateType: keyof typeof emailTemplates,
  data: TemplateData
): EmailTemplate => {
  return emailTemplates[templateType](data);
};

// Simplified templates for automation
export function getWelcomeEmailTemplate(username: string) {
  return emailTemplates.welcome({ userName: username });
}

export function getInactivityReminderTemplate(username: string, daysSinceLastLogin: number) {
  return {
    subject: `We miss you at Lift Metric! Come back and see what's new 👋`,
    text: `Hi ${username},\n\nWe noticed it's been ${daysSinceLastLogin} days since your last visit. We'd love to have you back!\n\nYour account is still active with all your saved calculations and history.\n\nLog back in and pick up where you left off!\n\nBest regards,\nThe Lift Metric Team`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; }
            .content { background: #f8f9fa; padding: 30px; margin-top: 20px; border-radius: 10px; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>We miss you! 👋</h1>
            </div>
            <div class="content">
              <p>Hi ${username},</p>
              <p>We noticed it's been <strong>${daysSinceLastLogin} days</strong> since your last visit. We'd love to have you back!</p>
              <p>Your account is still active with:</p>
              <ul>
                <li>All your saved calculations</li>
                <li>Your calculation history</li>
                <li>Access to our full suite of tools</li>
              </ul>
              <a href="#" class="button">Log Back In</a>
              <p>Best regards,<br>The Lift Metric Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}
