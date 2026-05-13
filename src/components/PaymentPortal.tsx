import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CreditCard, FileText, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useEntity } from '../hooks/useEntity';
import { paymentTransactionEntityConfig } from '../entities/PaymentTransaction';
import { formatAmount } from '../lib/paymentService';

type PaymentTransaction = {
  id: number;
  userId: string;
  stripePaymentIntentId: string;
  stripeCustomerId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled' | 'refunded';
  paymentMethod: string;
  planType: string;
  billingInterval: string;
  errorMessage: string;
  metadata: string;
  created_at: string;
  updated_at: string;
};

interface PaymentPortalProps {
  userId: string;
}

export default function PaymentPortal({ userId }: PaymentPortalProps) {
  const { items: transactions, loading } = useEntity<PaymentTransaction>(paymentTransactionEntityConfig);
  const [filter, setFilter] = useState<'all' | 'succeeded' | 'failed'>('all');

  const userTransactions = transactions
    .filter(t => t.userId === userId)
    .filter(t => filter === 'all' ? true : t.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'failed':
      case 'canceled':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'processing':
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      succeeded: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      canceled: 'bg-gray-100 text-gray-800',
      processing: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-blue-100 text-blue-800',
      refunded: 'bg-purple-100 text-purple-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">Loading payment history...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment History
              </CardTitle>
              <CardDescription>View all your payment transactions</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filter === 'succeeded' ? 'default' : 'outline'}
                onClick={() => setFilter('succeeded')}
                size="sm"
              >
                Successful
              </Button>
              <Button
                variant={filter === 'failed' ? 'default' : 'outline'}
                onClick={() => setFilter('failed')}
                size="sm"
              >
                Failed
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {userTransactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No payment transactions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{getStatusIcon(transaction.status)}</div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">
                            {transaction.planType === 'basic' ? 'Basic' : 'Pro'} Plan
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                              transaction.status
                            )}`}
                          >
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {transaction.billingInterval === 'monthly' ? 'Monthly' : 'Annual'} subscription
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        {transaction.errorMessage && (
                          <p className="text-sm text-red-600 mt-2">{transaction.errorMessage}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">
                        {formatAmount(transaction.amount, transaction.currency.toUpperCase())}
                      </p>
                      <p className="text-xs text-gray-500">Payment ID: {transaction.stripePaymentIntentId.slice(-8)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
