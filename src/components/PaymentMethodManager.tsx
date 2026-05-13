import { useState } from "react";
import { useEntity } from "../hooks/useEntity";
import { paymentMethodEntityConfig } from "../entities";
import type { PaymentMethod } from "../types/billing";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { CreditCard, Trash2, Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type PaymentMethodManagerProps = {
  userId: string;
  paymentMethods: PaymentMethod[];
  showMessage: (type: "success" | "error", text: string) => void;
};

export default function PaymentMethodManager({
  userId,
  paymentMethods,
  showMessage,
}: PaymentMethodManagerProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardBrand, setCardBrand] = useState("Visa");

  const { create, update, remove, reload } = useEntity<PaymentMethod>(paymentMethodEntityConfig);

  const resetForm = () => {
    setCardNumber("");
    setExpiryMonth("");
    setExpiryYear("");
    setCvv("");
    setCardBrand("Visa");
  };

  const handleAddPaymentMethod = async () => {
    if (!cardNumber || !expiryMonth || !expiryYear || !cvv) {
      showMessage("error", "Please fill in all fields");
      return;
    }

    if (cardNumber.length !== 16) {
      showMessage("error", "Card number must be 16 digits");
      return;
    }

    setIsProcessing(true);

    try {
      // In a real app, this would tokenize the card with the payment gateway
      const isFirstCard = paymentMethods.length === 0;
      
      await create({
        userId,
        type: "card",
        last4: cardNumber.slice(-4),
        brand: cardBrand,
        expiryMonth,
        expiryYear,
        isDefault: isFirstCard ? "true" : "false",
      });

      await reload();
      setShowAddDialog(false);
      resetForm();
      showMessage("success", "Payment method added successfully!");
    } catch (error) {
      showMessage("error", "Failed to add payment method. Please try again.");
      console.error("Add payment method error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSetDefault = async (method: PaymentMethod) => {
    setIsProcessing(true);

    try {
      // Set all to non-default
      for (const pm of paymentMethods) {
        if (pm.isDefault === "true") {
          await update(pm.id, { ...pm, isDefault: "false" });
        }
      }

      // Set selected as default
      await update(method.id, { ...method, isDefault: "true" });
      await reload();
      showMessage("success", "Default payment method updated!");
    } catch (error) {
      showMessage("error", "Failed to update default payment method.");
      console.error("Set default error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeletePaymentMethod = async () => {
    if (!selectedMethod) return;

    setIsProcessing(true);

    try {
      await remove(selectedMethod.id);
      await reload();
      setShowDeleteDialog(false);
      setSelectedMethod(null);
      showMessage("success", "Payment method removed successfully!");
    } catch (error) {
      showMessage("error", "Failed to remove payment method.");
      console.error("Delete payment method error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    return cleaned.slice(0, 16);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear + i);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Payment Methods
              </CardTitle>
              <CardDescription>Manage your payment methods securely</CardDescription>
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No payment methods on file</p>
              <p className="text-sm text-gray-500">Add a payment method to manage your subscription</p>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-8 w-8 text-gray-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">
                          {method.brand} •••• {method.last4}
                        </p>
                        {method.isDefault === "true" && <Badge>Default</Badge>}
                      </div>
                      <p className="text-sm text-gray-600">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {method.isDefault !== "true" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(method)}
                        disabled={isProcessing}
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedMethod(method);
                        setShowDeleteDialog(true);
                      }}
                      disabled={isProcessing}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Enter your payment details securely. Your information is encrypted and safe.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cardBrand">Card Type</Label>
              <Select value={cardBrand} onValueChange={setCardBrand}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Visa">Visa</SelectItem>
                  <SelectItem value="Mastercard">Mastercard</SelectItem>
                  <SelectItem value="American Express">American Express</SelectItem>
                  <SelectItem value="Discover">Discover</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234567812345678"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={16}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryMonth">Month</Label>
                <Select value={expiryMonth} onValueChange={setExpiryMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = (i + 1).toString().padStart(2, "0");
                      return (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryYear">Year</Label>
                <Select value={expiryYear} onValueChange={setExpiryYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="YYYY" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  maxLength={4}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleAddPaymentMethod} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Add Payment Method"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Payment Method</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this payment method?
            </DialogDescription>
          </DialogHeader>
          {selectedMethod && (
            <div className="py-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <CreditCard className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    {selectedMethod.brand} •••• {selectedMethod.last4}
                  </p>
                  <p className="text-sm text-gray-600">
                    Expires {selectedMethod.expiryMonth}/{selectedMethod.expiryYear}
                  </p>
                </div>
              </div>
              {selectedMethod.isDefault === "true" && (
                <p className="text-sm text-amber-600 mt-3">
                  This is your default payment method. Make sure to set another as default before removing.
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePaymentMethod} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove Payment Method"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
