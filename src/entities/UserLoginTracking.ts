import type { EntityConfig } from "../hooks/useEntity";

export const userLoginTrackingEntityConfig: EntityConfig = {
  name: "UserLoginTracking",
  orderBy: "last_login_at DESC",
  properties: {
    userId: { type: "string", description: "User identifier" },
    email: { type: "string", description: "User email address" },
    username: { type: "string", description: "User display name" },
    lastLoginAt: { type: "string", description: "ISO timestamp of last login" },
    loginCount: { type: "integer", default: "0", description: "Total number of logins" },
    signupDate: { type: "string", description: "ISO timestamp of user signup" },
    isActive: { type: "string", default: "true", description: "Whether user is active" },
    inactivityEmailSent: { type: "string", default: "false", description: "Whether inactivity email was sent" },
    welcomeEmailSent: { type: "string", default: "false", description: "Whether welcome email was sent" },
    lastActivityAt: { type: "string", description: "ISO timestamp of last activity" },
  },
  required: ["userId", "email"],
};
