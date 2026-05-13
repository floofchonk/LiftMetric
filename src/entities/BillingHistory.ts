import type { EntityConfig } from "../hooks/useEntity";

export const billingHistoryEntityConfig: EntityConfig = {
  name: "BillingHistory",
  orderBy: "invoiceDate DESC",
  properties: {
    userId: { type: "string", description: "User identifier" },
    invoiceNumber: { type: "string", description: "Invoice number" },
    invoiceDate: { type: "string", format: "date", description: "Invoice date" },
    amount: { type: "number", description: "Invoice amount" },
    status: { 
      type: "string", 
      enum: ["paid", "pending", "failed", "refunded"],
      description: "Payment status" 
    },
    description: { type: "string", description: "Invoice description" },
    pdfUrl: { type: "string", description: "URL to invoice PDF" },
  },
  required: ["userId", "invoiceNumber", "invoiceDate", "amount", "status", "description"],
};
