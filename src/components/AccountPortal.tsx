import { useState } from "react";
import { User, CreditCard, Receipt, Settings, LogOut, Crown, Shield, Zap, Check, Loader2, X } from "lucide-react";

type AuthUser = {
  id: number;
  email: string;
  name: string;
  subscriptionPlan: "free" | "professional" | "enterprise";
  subscriptionStatus: "active" | "canceled" | "expired" | "trial";
  billingCycle: "monthly" | "annual";
  nextBillingDate: string;
  trialEndsAt: string;
  created_at: string;
  updated_at: string;
};

type PaymentMethod = {
  id: number;
  userId: number;
  cardType: string;
  lastFourDigits: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: string;
  created_at: string;
  updated_at: string;
};

type BillingHistory = {
  id: number;
  userId: number;
  amount: number;
  description: string;
  status: string;
  invoiceDate: string;
  created_at: string;
  updated_at: string;
};

type AccountPortalProps = {
  user: AuthUser;
  onLogout: () => void;
  onUpdateSubscription: (plan: "free" | "professional" | "enterprise", cycle: "monthly" | "annual") => Promise<{ success: boolean; error?: string }>;
  paymentMethods: PaymentMethod[];
  billingHistory: BillingHistory[];
  onAddPaymentMethod: (method: Omit<PaymentMethod, "id" | "created_at" | "updated_at">) => Promise<void>;
  onRemovePaymentMethod: (id: number) => Promise<void>;
};

export default function AccountPortal({
  user,
  onLogout,
  onUpdateSubscription,
  paymentMethods,
  billingHistory,
  onAddPaymentMethod,
  onRemovePaymentMethod,
}: AccountPortalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "subscription" | "payment" | "billing">("overview");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({ cardNumber: "", expiry: "", cvv: "", cardType: "visa" });

  const plans = [
    {
      id: "free",
      name: "Free",
      price: { monthly: 0, annual: 0 },
      icon: Zap,
      features: ["5 ROI scenarios", "Basic comparisons", "PDF export", "Email support"],
    },
    {
      id: "professional",
      name: "Professional",
      price: { monthly: 29, annual: 290 },
      icon: Crown,
      features: ["Unlimited scenarios", "Advanced analytics", "All export formats", "Priority support", "Custom branding"],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: { monthly: 99, annual: 990 },
      icon: Shield,
      features: ["Everything in Pro", "Team collaboration", "API access", "Dedicated account manager", "Custom integrations"],
    },
  ];

  const handlePlanChange = async (planId: "free" | "professional" | "enterprise") => {
    if (planId === user.subscriptionPlan) return;

    setLoading(true);
    setMessage(null);

    const result = await onUpdateSubscription(planId, user.billingCycle);
    
    if (result.success) {
      setMessage({ type: "success", text: `Successfully ${planId === "free" ? "downgraded to" : "upgraded to"} ${planId} plan!` });
    } else {
      setMessage({ type: "error", text: result.error || "Failed to update subscription" });
    }
    
    setLoading(false);
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const lastFour = newCard.cardNumber.slice(-4);
      const [month, year] = newCard.expiry.split("/");

      await onAddPaymentMethod({
        userId: user.id,
        cardType: newCard.cardType,
        lastFourDigits: lastFour,
        expiryMonth: month,
        expiryYear: `20${year}`,
        isDefault: paymentMethods.length === 0 ? "true" : "false",
      });

      setMessage({ type: "success", text: "Payment method added successfully!" });
      setShowAddCard(false);
      setNewCard({ cardNumber: "", expiry: "", cvv: "", cardType: "visa" });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to add payment method" });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCard = async (id: number) => {
    if (!confirm("Remove this payment method?")) return;

    setLoading(true);
    setMessage(null);

    try {
      await onRemovePaymentMethod(id);
      setMessage({ type: "success", text: "Payment method removed" });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to remove payment method" });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const daysUntilTrialEnd = user.subscriptionStatus === "trial" 
    ? Math.ceil((new Date(user.trialEndsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-1">Account Portal</h1>
                <p className="text-blue-100">Manage your subscription and billing</p>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Message Banner */}
          {message && (
            <div className={`p-4 ${message.type === "success" ? "bg-green-50 text-green-800 border-b border-green-200" : "bg-red-50 text-red-800 border-b border-red-200"}`}>
              <div className="flex items-center justify-between max-w-6xl mx-auto">
                <span>{message.text}</span>
                <button onClick={() => setMessage(null)} className="text-current opacity-60 hover:opacity-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              {[
                { id: "overview", label: "Overview", icon: User },
                { id: "subscription", label: "Subscription", icon: Crown },
                { id: "payment", label: "Payment Methods", icon: CreditCard },
                { id: "billing", label: "Billing History", icon: Receipt },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                      activeTab === tab.id
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="text-lg font-medium text-gray-900">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-lg font-medium text-gray-900">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Member Since</p>
                        <p className="text-lg font-medium text-gray-900">{formatDate(user.created_at)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Plan</p>
                        <p className="text-2xl font-bold text-purple-600 capitalize">{user.subscriptionPlan}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <div className="flex items-center gap-2">
                          <span className={`inline-block w-2 h-2 rounded-full ${user.subscriptionStatus === "active" ? "bg-green-500" : user.subscriptionStatus === "trial" ? "bg-blue-500" : "bg-gray-400"}`}></span>
                          <p className="text-lg font-medium text-gray-900 capitalize">{user.subscriptionStatus}</p>
                        </div>
                      </div>
                      {user.subscriptionStatus === "trial" && (
                        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                          <p className="text-sm text-blue-800 font-medium">
                            {daysUntilTrialEnd} days left in your trial
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-600">Next Billing Date</p>
                        <p className="text-lg font-medium text-gray-900">{formatDate(user.nextBillingDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                  <div className="flex items-start gap-4">
                    <Settings className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => setActiveTab("subscription")}
                          className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 text-sm font-medium"
                        >
                          Change Plan
                        </button>
                        <button
                          onClick={() => setActiveTab("payment")}
                          className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 text-sm font-medium"
                        >
                          Manage Payment
                        </button>
                        <button
                          onClick={() => setActiveTab("billing")}
                          className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 text-sm font-medium"
                        >
                          View Invoices
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "subscription" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Plan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan) => {
                    const Icon = plan.icon;
                    const isCurrentPlan = plan.id === user.subscriptionPlan;
                    return (
                      <div
                        key={plan.id}
                        className={`rounded-xl p-6 border-2 transition-all ${
                          isCurrentPlan
                            ? "border-blue-600 bg-blue-50 shadow-lg"
                            : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`p-2 rounded-lg ${isCurrentPlan ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-gray-900">
                              ${user.billingCycle === "monthly" ? plan.price.monthly : plan.price.annual}
                            </span>
                            <span className="text-gray-600">/{user.billingCycle === "monthly" ? "mo" : "yr"}</span>
                          </div>
                          {user.billingCycle === "annual" && plan.price.annual > 0 && (
                            <p className="text-sm text-green-600 font-medium mt-1">
                              Save ${plan.price.monthly * 12 - plan.price.annual}/year
                            </p>
                          )}
                        </div>

                        <ul className="space-y-3 mb-6">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <button
                          onClick={() => handlePlanChange(plan.id as "free" | "professional" | "enterprise")}
                          disabled={isCurrentPlan || loading}
                          className={`w-full py-3 rounded-lg font-semibold transition-all ${
                            isCurrentPlan
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                          }`}
                        >
                          {loading ? (
                            <span className="flex items-center justify-center gap-2">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Processing...
                            </span>
                          ) : isCurrentPlan ? (
                            "Current Plan"
                          ) : (
                            `Switch to ${plan.name}`
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "payment" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
                  <button
                    onClick={() => setShowAddCard(!showAddCard)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
                  >
                    {showAddCard ? "Cancel" : "Add Payment Method"}
                  </button>
                </div>

                {showAddCard && (
                  <form onSubmit={handleAddCard} className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Card</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                        <input
                          type="text"
                          value={newCard.cardNumber}
                          onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value.replace(/\D/g, "").slice(0, 16) })}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          value={newCard.expiry}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, "");
                            if (value.length >= 2) {
                              value = value.slice(0, 2) + "/" + value.slice(2, 4);
                            }
                            setNewCard({ ...newCard, expiry: value });
                          }}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                        <input
                          type="text"
                          value={newCard.cvv}
                          onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                          placeholder="123"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium disabled:bg-blue-400"
                    >
                      {loading ? "Adding..." : "Add Card"}
                    </button>
                  </form>
                )}

                <div className="space-y-4">
                  {paymentMethods.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                      <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No payment methods added yet</p>
                    </div>
                  ) : (
                    paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <CreditCard className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 capitalize">
                              {method.cardType} •••• {method.lastFourDigits}
                            </p>
                            <p className="text-sm text-gray-600">
                              Expires {method.expiryMonth}/{method.expiryYear}
                            </p>
                          </div>
                          {method.isDefault === "true" && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveCard(method.id)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-700 font-medium text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "billing" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing History</h2>
                <div className="space-y-4">
                  {billingHistory.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                      <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No billing history yet</p>
                    </div>
                  ) : (
                    billingHistory.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg ${item.status === "paid" ? "bg-green-50" : "bg-yellow-50"}`}>
                            <Receipt className={`w-6 h-6 ${item.status === "paid" ? "text-green-600" : "text-yellow-600"}`} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.description}</p>
                            <p className="text-sm text-gray-600">{formatDate(item.invoiceDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold text-gray-900">${item.amount.toFixed(2)}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {item.status.toUpperCase()}
                          </span>
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            Download
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
