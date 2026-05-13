import { useState } from "react";
import { useEntity } from "../hooks/useEntity";
import {
  subscriptionEntityConfig,
  paymentMethodEntityConfig,
  billingHistoryEntityConfig,
} from "../entities";
import type { Subscription, PaymentMethod, BillingHistory } from "../types/billing";
import { PLANS } from "../types/billing";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { CreditCard, CheckCircle, AlertCircle, Download, Calendar } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import PaymentMethodManager from "./PaymentMethodManager";
import PlanSelector from "./PlanSelector";

const DEMO_USER_ID = "demo-user-123";

export default function BillingPortal() {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const { items: subscriptions, loading: subsLoading, reload: reloadSubs } = useEntity<Subscription>(subscriptionEntityConfig);
  const { items: paymentMethods, loading: pmLoading } = useEntity<PaymentMethod>(paymentMethodEntityConfig);
  const { items: billingHistory, loading: bhLoading } = useEntity<BillingHistory>(billingHistoryEntityConfig);

  const currentSubscription = subscriptions.find(
    (sub) => sub.userId === DEMO_USER_ID && sub.status === "active"
  );

  const userPaymentMethods = paymentMethods.filter((pm) => pm.userId === DEMO_USER_ID);
  const defaultPaymentMethod = userPaymentMethods.find((pm) => pm.isDefault === "true");

  const userBillingHistory = billingHistory.filter((bh) => bh.userId === DEMO_USER_ID);

  const currentPlan = PLANS.find((p) => p.id === currentSubscription?.planId) || PLANS[0];

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handlePlanChange = async () => {
    await reloadSubs();
    showMessage("success", "Plan updated successfully!");
    setActiveTab("overview");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      active: { variant: "default", label: "Active" },
      trialing: { variant: "secondary", label: "Trial" },
      canceled: { variant: "outline", label: "Canceled" },
      past_due: { variant: "destructive", label: "Past Due" },
      paid: { variant: "default", label: "Paid" },
      pending: { variant: "secondary", label: "Pending" },
      failed: { variant: "destructive", label: "Failed" },
      refunded: { variant: "outline", label: "Refunded" },
    };
    const config = variants[status] || { variant: "outline" as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (subsLoading || pmLoading || bhLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Billing & Subscription</h1>
          <p className="text-gray-600">Manage your subscription, payment methods, and billing history</p>
        </div>

        {message && (
          <Alert className={`mb-6 ${message.type === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}>
            {message.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
            <TabsTrigger value="history">Billing History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Current Plan
                  </CardTitle>
                  <CardDescription>Your active subscription details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{currentPlan.name}</h3>
                      <p className="text-gray-600">
                        ${currentPlan.price}/{currentSubscription?.billingCycle || "month"}
                      </p>
                    </div>
                    {currentSubscription && getStatusBadge(currentSubscription.status)}
                  </div>

                  {currentSubscription && (
                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Current period:</span>
                        <span className="font-medium">
                          {formatDate(currentSubscription.currentPeriodStart)} - {formatDate(currentSubscription.currentPeriodEnd)}
                        </span>
                      </div>
                      {currentSubscription.cancelAtPeriodEnd === "true" && (
                        <Alert className="border-yellow-500 bg-yellow-50">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                          <AlertDescription className="text-yellow-800">
                            Your subscription will cancel on {formatDate(currentSubscription.currentPeriodEnd)}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}

                  <div className="pt-4">
                    <Button onClick={() => setActiveTab("plans")} className="w-full">
                      {currentPlan.id === "free" ? "Upgrade Plan" : "Change Plan"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>Your default payment information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {defaultPaymentMethod ? (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {defaultPaymentMethod.brand} •••• {defaultPaymentMethod.last4}
                          </p>
                          <p className="text-sm text-gray-600">
                            Expires {defaultPaymentMethod.expiryMonth}/{defaultPaymentMethod.expiryYear}
                          </p>
                        </div>
                      </div>
                      <Badge>Default</Badge>
                    </div>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>No payment method on file</AlertDescription>
                    </Alert>
                  )}

                  <Button onClick={() => setActiveTab("payment")} variant="outline" className="w-full">
                    Manage Payment Methods
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Plan Features</CardTitle>
                <CardDescription>What's included in your current plan</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plans">
            <PlanSelector
              currentPlanId={currentPlan.id}
              currentSubscription={currentSubscription}
              onPlanChange={handlePlanChange}
              showMessage={showMessage}
            />
          </TabsContent>

          <TabsContent value="payment">
            <PaymentMethodManager
              userId={DEMO_USER_ID}
              paymentMethods={userPaymentMethods}
              showMessage={showMessage}
            />
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Billing History
                </CardTitle>
                <CardDescription>View and download your past invoices</CardDescription>
              </CardHeader>
              <CardContent>
                {userBillingHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No billing history yet</p>
                    <p className="text-sm text-gray-500">Your invoices will appear here once you have a paid subscription</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userBillingHistory.map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-medium text-gray-900">{invoice.description}</p>
                            {getStatusBadge(invoice.status)}
                          </div>
                          <p className="text-sm text-gray-600">
                            Invoice #{invoice.invoiceNumber} • {formatDate(invoice.invoiceDate)}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-lg font-bold text-gray-900">${invoice.amount.toFixed(2)}</p>
                          {invoice.pdfUrl && (
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              PDF
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
