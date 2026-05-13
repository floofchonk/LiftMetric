import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { MessageSquare, Bug, Lightbulb, MessageCircle, Check, AlertCircle } from "lucide-react";
import { useEntity } from "../hooks/useEntity";
import { feedbackSubmissionEntityConfig } from "../entities/FeedbackSubmission";
import { useAuth } from "../hooks/useAuth";

export function FeedbackPortal() {
  const { currentUser } = useAuth();
  const { create, loading } = useEntity(feedbackSubmissionEntityConfig);
  
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    category: "",
    subject: "",
    message: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { value: "feature_request", label: "Feature Request", icon: Lightbulb, color: "text-purple-600" },
    { value: "bug_report", label: "Bug Report", icon: Bug, color: "text-red-600" },
    { value: "general_feedback", label: "General Feedback", icon: MessageCircle, color: "text-blue-600" },
    { value: "improvement", label: "Improvement Suggestion", icon: MessageSquare, color: "text-green-600" },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.length < 5) {
      newErrors.subject = "Subject must be at least 5 characters";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 20) {
      newErrors.message = "Please provide more details (at least 20 characters)";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await create({
        userId: currentUser?.id?.toString() || "guest",
        userName: formData.userName || "Anonymous",
        email: formData.email,
        category: formData.category,
        subject: formData.subject,
        message: formData.message,
        priority: "medium",
        status: "new",
      });

      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          userName: currentUser?.name || "",
          email: currentUser?.email || "",
          category: "",
          subject: "",
          message: "",
        });
      }, 3000);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-900 mb-2">
                Thank You for Your Feedback!
              </h2>
              <p className="text-green-700 mb-4">
                We've received your {formData.category.replace("_", " ")} and appreciate you taking the time to help us improve.
              </p>
              <p className="text-sm text-green-600">
                {formData.email ? "We'll follow up with you via email if we need more information." : ""}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback Portal</h1>
        <p className="text-gray-600">
          Help us improve Lift Metric by sharing your thoughts, suggestions, or reporting issues.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit Your Feedback</CardTitle>
          <CardDescription>
            All feedback is reviewed by our team. Fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div>
              <Label htmlFor="category" className="text-base font-semibold mb-3 block">
                Category *
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Card
                      key={cat.value}
                      className={`cursor-pointer transition-all duration-200 ${
                        formData.category === cat.value
                          ? "border-blue-500 border-2 bg-blue-50"
                          : "hover:border-gray-300"
                      }`}
                      onClick={() => handleChange("category", cat.value)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-6 h-6 ${cat.color}`} />
                          <span className="font-medium">{cat.label}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              {errors.category && (
                <div className="flex items-center space-x-1 text-red-600 text-sm mt-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.category}</span>
                </div>
              )}
            </div>

            {/* Name Input */}
            <div>
              <Label htmlFor="userName">Your Name (Optional)</Label>
              <Input
                id="userName"
                value={formData.userName}
                onChange={(e) => handleChange("userName", e.target.value)}
                placeholder="Enter your name"
                className="mt-1"
              />
            </div>

            {/* Email Input */}
            <div>
              <Label htmlFor="email">Email (Optional - for follow-up)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="your.email@example.com"
                className="mt-1"
              />
              {errors.email && (
                <div className="flex items-center space-x-1 text-red-600 text-sm mt-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                We'll only use your email to follow up on your feedback
              </p>
            </div>

            {/* Subject Input */}
            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                placeholder="Brief summary of your feedback"
                className="mt-1"
              />
              {errors.subject && (
                <div className="flex items-center space-x-1 text-red-600 text-sm mt-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.subject}</span>
                </div>
              )}
            </div>

            {/* Message Textarea */}
            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                placeholder="Please provide as much detail as possible..."
                rows={6}
                className="mt-1"
              />
              <div className="flex justify-between items-center mt-2">
                <div>
                  {errors.message && (
                    <div className="flex items-center space-x-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.message}</span>
                    </div>
                  )}
                </div>
                <span className={`text-sm ${formData.message.length < 20 ? "text-gray-400" : "text-gray-600"}`}>
                  {formData.message.length} / 20 min
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    userName: currentUser?.name || "",
                    email: currentUser?.email || "",
                    category: "",
                    subject: "",
                    message: "",
                  });
                  setErrors({});
                }}
              >
                Clear Form
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>• Your feedback is submitted to our team for review</li>
            <li>• We prioritize based on impact and feasibility</li>
            <li>• If you provided an email, we may reach out for clarification</li>
            <li>• Feature requests are considered for future updates</li>
            <li>• Bug reports are investigated and fixed in priority order</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
