import type { EntityConfig } from "../hooks/useEntity";

export const sharedCalculationEntityConfig: EntityConfig = {
  name: "SharedCalculation",
  orderBy: "created_at DESC",
  properties: {
    calculationId: {
      type: "string",
      description: "Reference to the original calculation",
    },
    shareId: {
      type: "string",
      description: "Unique shareable identifier/token",
    },
    title: {
      type: "string",
      description: "Title of the shared calculation",
    },
    description: {
      type: "string",
      description: "Description of what's being shared",
    },
    calculationType: {
      type: "string",
      enum: ["basic", "scientific", "roi", "scenario", "history"],
      description: "Type of calculation being shared",
    },
    calculationData: {
      type: "string",
      description: "JSON string of calculation data and results",
    },
    ownerId: {
      type: "string",
      description: "User ID of the owner",
    },
    ownerName: {
      type: "string",
      description: "Display name of the owner",
    },
    ownerEmail: {
      type: "string",
      description: "Email of the owner",
    },
    accessLevel: {
      type: "string",
      enum: ["view", "comment", "edit"],
      default: "view",
      description: "Permission level for shared users",
    },
    privacyLevel: {
      type: "string",
      enum: ["public", "anyone-with-link", "specific-users"],
      default: "anyone-with-link",
      description: "Who can access this share",
    },
    allowDownload: {
      type: "string",
      default: "true",
      description: "Whether downloads are allowed",
    },
    allowCopy: {
      type: "string",
      default: "true",
      description: "Whether copying is allowed",
    },
    expiresAt: {
      type: "string",
      format: "date",
      description: "Optional expiration date for the share",
    },
    viewCount: {
      type: "integer",
      default: 0,
      description: "Number of times this has been viewed",
    },
    isActive: {
      type: "string",
      default: "true",
      description: "Whether the share is currently active",
    },
    invitedUsers: {
      type: "string",
      description: "JSON array of invited user emails",
    },
    tags: {
      type: "string",
      description: "JSON array of tags for organization",
    },
  },
  required: ["shareId", "title", "calculationType", "calculationData", "ownerId"],
};
