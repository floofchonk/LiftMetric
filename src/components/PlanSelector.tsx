import { useState } from "react";
import { useEntity } from "../hooks/useEntity";
import { subscriptionEntityConfig } from "../entities";
import type { Subscription, PlanId } from "../types/billing";
import { PLANS } from "../types/billing";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type PlanSelectorProps = {
  currentPlanId: PlanId;
  currentSubscription?: Subscription;
  onPlanChange: () => void;
  showMessage: (type: "success" | "error", text: string) => void;
};

const DEMO_USER_ID = "demo-user-123";

export default function PlanSelector({
  currentPlanId,
  currentSubscription,
  onPlanChange,
  showMessage,
}: PlanSelectorProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { create, update } = useEntity<Subscription>(subscriptionEntityConfig);

  const handleSelectPlan = (planId: PlanId) => {
    if (planId === currentPlanId) return;
    setSelectedPlan(planId);
    setShowConfirmDialog(true);
  };

  const handleConfirmChange = async () => {
    if (!selectedPlan) return;

    setIsProcessing(true);

    try {
      const plan = PLANS.find((p) => p.id === selectedPlan);
      if (!plan) throw new Error("Plan not found");

      const now = new Date();
      const periodEnd = new Date(now);
      periodEnd.setMonth(periodEnd.getMonth() + (plan.billingCycle === "annual" ? 12 : 1));

      const subscriptionData = {
        userId: DEMO_USER_ID,
        planId: plan.id,
        planName: plan.name,
        status: "active" as const,
        billingCycle: plan.billingCycle,
        amount: plan.price,
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: periodEnd.toISOString(),
        cancelAtPeriodEnd: "false",
      };

      if (currentSubscription) {
        await update(currentSubscription.id, subscriptionData);
      } else {
        await create(subscriptionData);
      }

      setShowConfirmDialog(false);
      onPlanChange();
    } catch (error) {
      showMessage("error", "Failed to update plan. Please try again.");
      console.error("Plan change error:", error);
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  const isUpgrade = (planId: PlanId) => {
    const planOrder = { free: 0, professional: 1, enterprise: 2 };
    return planOrder[planId] > planOrder[currentPlanId];
  };

  const selectedPlanObj = PLANS.find((p) => p.id === selectedPlan);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          const upgrade = isUpgrade(plan.id);

          return (
            <Card
              key={plan.id}
              className={`relative ${
                plan.recommended ? "border-blue-500 border-2 shadow-lg" : ""
              } ${isCurrent ? "bg-blue-50" : ""}`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white">Recommended</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{plan.name}</span>
                  {isCurrent && (
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Current
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  <div className="mt-2">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600">/{plan.billingCycle === "annual" ? "year" : "month"}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isCurrent}
                  className="w-full"
                  variant={isCurrent ? "outline" : upgrade ? "default" : "secondary"}
                >
                  {isCurrent ? "Current Plan" : upgrade ? "Upgrade" : "Downgrade"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Plan Change</DialogTitle>
            <DialogDescription>
              {selectedPlanObj && (
                <span>
                  You are about to {isUpgrade(selectedPlanObj.id) ? "upgrade" : "downgrade"} to the{" "}
                  <strong>{selectedPlanObj.name}</strong> plan at{" "}
                  <strong>${selectedPlanObj.price}/{selectedPlanObj.billingCycle === "annual" ? "year" : "month"}</strong>.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedPlanObj && (
              <div className="space-y-2 text-sm">
                <p className="font-medium">What happens next:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {isUpgrade(selectedPlanObj.id) ? (
                    <>
                      <li>Your new plan takes effect immediately</li>
                      <li>You'll be charged ${selectedPlanObj.price} today</li>
                      <li>All premium features will be unlocked</li>
                    </>
                  ) : (
                    <>
                      <li>Your plan will change at the end of the current billing period</li>
                      <li>You'll retain current features until then</li>
                      <li>New rate applies on your next billing date</li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleConfirmChange} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Change"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
