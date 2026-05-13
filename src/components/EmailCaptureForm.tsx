import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useEntity } from "../hooks/useEntity";
import { emailSubscriberEntityConfig } from "../entities/EmailSubscriber";

type EmailSubscriber = {
  id: number;
  email: string;
  name: string;
  source: string;
  status: "active" | "unsubscribed";
  subscribedAt: string;
  created_at: string;
  updated_at: string;
};

type EmailCaptureFormProps = {
  source?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  showNameField?: boolean;
};

export default function EmailCaptureForm({
  source = "newsletter",
  title = "Stay Updated",
  description = "Subscribe to get the latest updates and features from Lift Metric",
  buttonText = "Subscribe",
  showNameField = true,
}: EmailCaptureFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const { create } = useEntity<EmailSubscriber>(emailSubscriberEntityConfig);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (!email.trim()) {
      setError("Email address is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (showNameField && !name.trim()) {
      setError("Name is required");
      return;
    }

    setLoading(true);

    try {
      await create({
        email: email.trim().toLowerCase(),
        name: name.trim(),
        source,
        status: "active",
        subscribedAt: new Date().toISOString(),
      });

      setSuccess(true);
      setEmail("");
      setName("");

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError("Failed to subscribe. Please try again later.");
      console.error("Email subscription error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Successfully Subscribed!</h3>
              <p className="text-gray-600 mt-2">
                Thank you for subscribing. We'll keep you updated with the latest from Lift Metric.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Mail className="w-6 h-6 text-blue-600" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {showNameField && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="w-full"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full"
            />
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              buttonText
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            By subscribing, you agree to receive emails from Lift Metric. You can unsubscribe at any time.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
