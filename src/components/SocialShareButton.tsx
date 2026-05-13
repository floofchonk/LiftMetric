import { useState } from "react";
import { Share2, Twitter, Linkedin, Mail, Check, ExternalLink } from "lucide-react";
import { useEntity } from "../hooks/useEntity";
import { socialShareEntityConfig } from "../entities";

type SocialShareButtonProps = {
  calculationResult?: {
    roi?: number;
    npv?: number;
    irr?: number;
    paybackPeriod?: number;
    projectName?: string;
  };
  shareType: "calculation" | "insight" | "milestone" | "referral" | "testimonial";
  customMessage?: string;
  userId?: string;
};

type SocialShare = {
  id: number;
  userId: string;
  platform: string;
  shareType: string;
  content: string;
  calculationData: string;
  clicks: number;
  conversions: number;
  shareUrl: string;
  created_at: string;
  updated_at: string;
};

export default function SocialShareButton({
  calculationResult,
  shareType,
  customMessage,
  userId = "anonymous",
}: SocialShareButtonProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const { create } = useEntity<SocialShare>(socialShareEntityConfig);

  const generateShareContent = (platform: string) => {
    if (customMessage) return customMessage;

    if (shareType === "calculation" && calculationResult) {
      const { roi, npv, irr, paybackPeriod, projectName } = calculationResult;
      
      if (platform === "twitter") {
        return `Just analyzed ${projectName || "my project"} with @LiftMetric! 📊\n\n✨ ROI: ${roi?.toFixed(1)}%\n💰 NPV: $${npv?.toLocaleString()}\n📈 IRR: ${irr?.toFixed(1)}%\n⏱️ Payback: ${paybackPeriod?.toFixed(1)} months\n\nMake smarter investment decisions with Lift Metric! 🚀`;
      } else if (platform === "linkedin") {
        return `I just completed a comprehensive financial analysis using Lift Metric and the results are impressive:\n\n📊 Project: ${projectName || "Investment Analysis"}\n✨ ROI: ${roi?.toFixed(1)}%\n💰 Net Present Value: $${npv?.toLocaleString()}\n📈 Internal Rate of Return: ${irr?.toFixed(1)}%\n⏱️ Payback Period: ${paybackPeriod?.toFixed(1)} months\n\nLift Metric makes complex financial calculations simple and actionable. Highly recommend for anyone managing projects or investments!`;
      }
    }

    return `Check out Lift Metric - the powerful calculator for ROI, NPV, and IRR analysis! 🚀`;
  };

  const handleShare = async (platform: string) => {
    const content = generateShareContent(platform);
    const shareUrl = `https://liftmetric.com?ref=${userId}`;
    
    // Track the share
    await create({
      userId,
      platform: platform as "twitter" | "linkedin" | "facebook" | "email",
      shareType,
      content,
      calculationData: calculationResult ? JSON.stringify(calculationResult) : "",
      clicks: 0,
      conversions: 0,
      shareUrl,
    });

    // Open share dialog
    if (platform === "twitter") {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}&url=${encodeURIComponent(shareUrl)}`;
      window.open(twitterUrl, "_blank", "width=550,height=420");
    } else if (platform === "linkedin") {
      const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
      window.open(linkedinUrl, "_blank", "width=550,height=420");
      // Note: LinkedIn doesn't support pre-filled text via URL, user will need to paste
      navigator.clipboard.writeText(content);
    } else if (platform === "email") {
      const subject = "Check out my Lift Metric results!";
      const mailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(content + "\n\n" + shareUrl)}`;
      window.location.href = mailUrl;
    }

    setShowOptions(false);
  };

  const copyShareLink = async () => {
    const shareUrl = `https://liftmetric.com?ref=${userId}`;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
      >
        <Share2 className="w-4 h-4" />
        <span>Share Results</span>
      </button>

      {showOptions && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowOptions(false)}
          />

          {/* Share Options Menu */}
          <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <p className="text-sm font-semibold text-gray-700">Share via</p>
            </div>

            <div className="p-2">
              <button
                onClick={() => handleShare("twitter")}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 group"
              >
                <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                  <Twitter className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900">X (Twitter)</p>
                  <p className="text-xs text-gray-500">Share on X</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              </button>

              <button
                onClick={() => handleShare("linkedin")}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 group mt-1"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                  <Linkedin className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900">LinkedIn</p>
                  <p className="text-xs text-gray-500">Share professionally</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              </button>

              <button
                onClick={() => handleShare("email")}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 group mt-1"
              >
                <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center group-hover:bg-gray-600 transition-colors">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-xs text-gray-500">Send via email</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </button>

              <div className="border-t border-gray-200 my-2" />

              <button
                onClick={copyShareLink}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
              >
                {copied ? (
                  <>
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-green-600">Copied!</p>
                      <p className="text-xs text-gray-500">Link in clipboard</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                      <Share2 className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900">Copy Link</p>
                      <p className="text-xs text-gray-500">Copy referral link</p>
                    </div>
                  </>
                )}
              </button>
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-600 text-center">
                🔒 Your privacy settings are respected
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
