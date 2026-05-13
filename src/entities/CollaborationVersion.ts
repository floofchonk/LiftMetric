import type { EntityConfig } from "../hooks/useEntity";

export const collaborationVersionEntityConfig: EntityConfig = {
  name: "CollaborationVersion",
  orderBy: "created_at DESC",
  properties: {
    sharedCalculationId: {
      type: "string",
      description: "Reference to the shared calculation",
    },
    versionNumber: {
      type: "integer",
      description: "Sequential version number",
    },
    calculationData: {
      type: "string",
      description: "JSON string of calculation data at this version",
    },
    changedBy: {
      type: "string",
      description: "User ID who made the change",
    },
    changedByName: {
      type: "string",
      description: "Display name of user who made the change",
    },
    changeDescription: {
      type: "string",
      description: "Description of what changed",
    },
    changeType: {
      type: "string",
      enum: ["created", "edited", "commented", "restored"],
      description: "Type of change made",
    },
    previousVersionId: {
      type: "string",
      description: "Reference to previous version",
    },
  },
  required: ["sharedCalculationId", "versionNumber", "calculationData", "changedBy"],
};
