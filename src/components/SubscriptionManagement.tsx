import { useState, useEffect } from 'react';
import { CreditCard, Calendar, Download, AlertCircle, CheckCircle, XCircle, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useEntity } from '../hooks/useEntity';
import { subscriptionEntityConfig, paymentMethodEntityConfig } from '../entities';

type Subscription = {
  id: number;
  userId: string;
  planId: string;
  planName: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  amount: number;
  currency: string;
  interval: string;
  created_at: string;
  updated_at: string;
};

type Payment = {
  id: number;
  userId: string;
  subscriptionId: number;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  stripePaymentIntentId: string;
  stripeInvoiceId: string;
  description: string;
  receiptUrl: string;
  created_at: string;
  updated_at: string;
};

const plans = [
  { id: 'free', name: 'Free', price: 0, interval: 'month', features: ['Basic calculations', 'Limited history', 'Standard support'] },
  { id: 'basic', name: 'Basic', price: 9.99, interval: 'month', features: ['Scientific mode', 'Unlimited history', 'Export data', 'Email support'] },
  { id: 'pro', name: 'Pro', price: 29.99, interval: 'month', features: ['All Basic features', 'Advanced analytics', 'API access', 'Priority support', 'Team collaboration'] }
];

export default function SubscriptionManagement() {
  const [activeTab, setActiveTab] = useState<'overview' | 'billing' | 'payment'>('overview');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const { items: subscriptions, loading: subsLoading, update: updateSubscription } = useEntity<Subscription>(subscriptionEntityConfig);
  const { items: payments, loading: paymentsLoading } = useEntity<Payment>(paymentMethodEntityConfig);

  const currentUserId = 'user_123'; // Replace with actual user ID from auth
  const currentSubscription = subscriptions.find(sub => sub.userId === currentUserId && sub.status === 'active');
  const userPayments = payments.filter(p => p.userId === currentUserId).sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleUpgrade = async (planId: string) => {
    setIsProcessing(true);
    try {
      // Simulate API call to Stripe
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const plan = plans.find(p => p.id === planId);
      if (!plan) throw new Error('Plan not found');

      if (currentSubscription) {
        await updateSubscription(currentSubscription.id, {
          planId: plan.id,
          planName: plan.name,
          amount: plan.price,
          updated_at: new Date().toISOString()
        });
      }

      showNotification('success', `Successfully upgraded to ${plan.name} plan!`);
      setShowUpgradeModal(false);
    } catch (error) {
      showNotification('error', 'Failed to update subscription. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsProcessing(true);
    try {
      // Simulate API call to Stripe
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (currentSubscription) {
        await updateSubscription(currentSubscription.id, {
          cancelAtPeriodEnd: 'true',
          updated_at: new Date().toISOString()
        });
      }

      showNotification('info', 'Subscription will be cancelled at the end of the billing period.');
      setShowCancelModal(false);
    } catch (error) {
      showNotification('error', 'Failed to cancel subscription. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReactivateSubscription = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (currentSubscription) {
        await updateSubscription(currentSubscription.id, {
          cancelAtPeriodEnd: 'false',
          updated_at: new Date().toISOString()
        });
      }

      showNotification('success', 'Subscription reactivated successfully!');
    } catch (error) {
      showNotification('error', 'Failed to reactivate subscription.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      past_due: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      trialing: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </span>
    );
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'refunded':
        return <ArrowDownCircle className="w-5 h-5 text-gray-600" />;
      default:
        return null;
    }
  };

  if (subsLoading || paymentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Notification Toast */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg border ${
            notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          } animate-fade-in`}>
            <div className="flex items-center gap-3">
              {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
              {notification.type === 'error' && <XCircle className="w-5 h-5" />}
              {notification.type === 'info' && <AlertCircle className="w-5 h-5" />}
              <p className="font-medium">{notification.message}</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Subscription & Billing</h1>
          <p className="text-gray-600">Manage your plan, billing, and payment information</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-all ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-all ${
                activeTab === 'billing'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Billing History
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-all ${
                activeTab === 'payment'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Payment Method
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Current Plan */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Current Plan</h2>
                {currentSubscription && getStatusBadge(currentSubscription.status)}
              </div>

              {currentSubscription ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900">{currentSubscription.planName}</h3>
                      <p className="text-gray-600 mt-1">
                        ${currentSubscription.amount.toFixed(2)} / {currentSubscription.interval}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Next billing date</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {currentSubscription.cancelAtPeriodEnd === 'true' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-yellow-800 font-medium">Subscription Ending</p>
                          <p className="text-yellow-700 text-sm mt-1">
                            Your subscription will end on {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}. 
                            You'll still have access until then.
                          </p>
                          <button
                            onClick={handleReactivateSubscription}
                            disabled={isProcessing}
                            className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all disabled:opacity-50"
                          >
                            {isProcessing ? 'Processing...' : 'Reactivate Subscription'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    {currentSubscription.planId !== 'pro' && (
                      <button
                        onClick={() => setShowUpgradeModal(true)}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                      >
                        <ArrowUpCircle className="w-5 h-5" />
                        Upgrade Plan
                      </button>
                    )}
                    {currentSubscription.cancelAtPeriodEnd !== 'true' && (
                      <button
                        onClick={() => setShowCancelModal(true)}
                        className="px-6 py-3 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-all"
                      >
                        Cancel Subscription
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">You don't have an active subscription</p>
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                  >
                    Choose a Plan
                  </button>
                </div>
              )}
            </div>

            {/* Plan Features */}
            {currentSubscription && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Plan Features</h2>
                <ul className="space-y-3">
                  {plans.find(p => p.id === currentSubscription.planId)?.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Billing History Tab */}
        {activeTab === 'billing' && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200">
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Billing History</h2>
              <p className="text-gray-600 mt-1">View and download your past invoices</p>
            </div>
            <div className="divide-y divide-gray-200">
              {userPayments.length > 0 ? (
                userPayments.map((payment) => (
                  <div key={payment.id} className="p-6 hover:bg-gray-50 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {getPaymentStatusIcon(payment.status)}
                        <div>
                          <p className="font-semibold text-gray-900">{payment.description}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(payment.created_at).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            ${payment.amount.toFixed(2)} {payment.currency.toUpperCase()}
                          </p>
                          <p className="text-sm text-gray-600 capitalize">{payment.status}</p>
                        </div>
                        {payment.receiptUrl && payment.status === 'succeeded' && (
                          <a
                            href={payment.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Download Receipt"
                          >
                            <Download className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No billing history yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment Method Tab */}
        {activeTab === 'payment' && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
            
            {currentSubscription ? (
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Card ending in ••••</p>
                      <p className="text-sm text-gray-600">Expires 12/2025</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Default
                    </span>
                  </div>
                </div>

                <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                  Update Payment Method
                </button>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong className="text-gray-900">Secure Payment:</strong> Your payment information is encrypted and processed securely through Stripe. 
                    We never store your full card details on our servers.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No payment method on file</p>
              </div>
            )}
          </div>
        )}

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <XCircle className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`border-2 rounded-xl p-6 transition-all ${
                        currentSubscription?.planId === plan.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-blue-500 hover:shadow-lg'
                      }`}
                    >
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                        <span className="text-gray-600"> / {plan.interval}</span>
                      </div>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {currentSubscription?.planId === plan.id ? (
                        <button
                          disabled
                          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold"
                        >
                          Current Plan
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedPlan(plan.id);
                            handleUpgrade(plan.id);
                          }}
                          disabled={isProcessing}
                          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold disabled:opacity-50"
                        >
                          {isProcessing && selectedPlan === plan.id ? 'Processing...' : 'Select Plan'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Cancel Subscription?</h2>
                <p className="text-gray-600">
                  You'll continue to have access until {currentSubscription && new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCancelSubscription}
                  disabled={isProcessing}
                  className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Yes, Cancel Subscription'}
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="w-full px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-semibold"
                >
                  Keep Subscription
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}