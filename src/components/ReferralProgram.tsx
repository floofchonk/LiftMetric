import React, { useState, useEffect, useMemo } from "react";
import {
  Gift,
  Copy,
  Check,
  Users,
  DollarSign,
  Share2,
  Mail,
  Twitter,
  Linkedin,
  Trophy,
  Star,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useEntity } from "../hooks/useEntity";

interface ReferralProgramProps {
  currentUser?: {
    id: string;
    name?: string;
    email?: string;
  } | null;
}

export default function ReferralProgram({ currentUser }: ReferralProgramProps) {
  const [referralCode, setReferralCode] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "referrals" | "rewards">("overview");

  const { items: referrals, create: createReferral } = useEntity<{
    id: number;
    referrerId: number;
    referralCode: string;
    status: string;
    referrerReward: string;
    referredReward: string;
    convertedAt?: string;
  }>({ name: "Referral", properties: { referrerId: { type: "number" }, referralCode: { type: "string" }, status: { type: "string" }, referrerReward: { type: "string" }, referredReward: { type: "string" }, convertedAt: { type: "string" } } });

  useEffect(() => {
    if (currentUser?.id) {
      const existingReferral = referrals.find(
        (r) => String(r.referrerId) === String(currentUser.id)
      );
      if (existingReferral) {
        setReferralCode(existingReferral.referralCode);
      } else {
        const newCode = `LIFT${Math.floor(Math.random() * 10000)}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        setReferralCode(newCode);
        createReferral({
          referrerId: parseInt(currentUser.id, 10) || 0,
          referralCode: newCode,
          status: "pending",
          referrerReward: "",
          referredReward: "",
        });
      }
    }
  }, [currentUser, referrals, createReferral]);

  const myReferrals = referrals.filter((r) => String(r.referrerId) === String(currentUser?.id));
  const convertedReferrals = myReferrals.filter((r) => r.status === "converted");
  const pendingReferrals = myReferrals.filter((r) => r.status === "pending");

  const referralLink = `https://liftmetric.com/signup?ref=${referralCode}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent("Try Lift Metric - ROI Calculator");
    const body = encodeURIComponent(
      `Hey! I've been using Lift Metric for ROI calculations and thought you'd find it useful.\n\nSign up using my link and we both get rewards: ${referralLink}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaTwitter = () => {
    const text = encodeURIComponent(
      `Check out Lift Metric - the best ROI calculator for business decisions! ${referralLink}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`);
  };

  const shareViaLinkedIn = () => {
    const url = encodeURIComponent(referralLink);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`);
  };

  const rewards = [
    { tier: "Bronze", referrals: 1, reward: "1 Month Free Premium", icon: "🥉" },
    { tier: "Silver", referrals: 5, reward: "3 Months Free Premium", icon: "🥈" },
    { tier: "Gold", referrals: 10, reward: "6 Months Free Premium", icon: "🥇" },
    { tier: "Platinum", referrals: 25, reward: "1 Year Free Premium", icon: "💎" },
  ];

  const currentTier = useMemo(() => {
    const count = convertedReferrals.length;
    if (count >= 25) return rewards[3];
    if (count >= 10) return rewards[2];
    if (count >= 5) return rewards[1];
    if (count >= 1) return rewards[0];
    return null;
  }, [convertedReferrals.length]);

  const nextTier = useMemo(() => {
    const count = convertedReferrals.length;
    if (count >= 25) return null;
    if (count >= 10) return rewards[3];
    if (count >= 5) return rewards[2];
    if (count >= 1) return rewards[1];
    return rewards[0];
  }, [convertedReferrals.length]);

  if (!currentUser) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-8 text-center">
        <Gift className="w-16 h-16 text-purple-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Refer Friends & Earn Rewards
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Sign in to access your personalized referral link and start earning rewards!
        </p>
        <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 font-semibold">
          Sign In to Get Started
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Gift className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Referral Program</h2>
        </div>
        <p className="text-purple-100">
          Share Lift Metric with friends and earn premium features!
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-purple-50 dark:bg-slate-700/50 border-b border-purple-100 dark:border-slate-600">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {myReferrals.length}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Total Referrals</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {convertedReferrals.length}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Converted</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {currentTier?.icon || "🎯"}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {currentTier?.tier || "No Tier"}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-slate-600">
        {[
          { id: "overview", label: "Overview", icon: Gift },
          { id: "referrals", label: "My Referrals", icon: Users },
          { id: "rewards", label: "Rewards", icon: Trophy },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400"
                : "text-gray-600 dark:text-gray-400 hover:text-purple-600 hover:bg-gray-50 dark:hover:bg-slate-700"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Referral Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Referral Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-gray-800 dark:text-gray-200 text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                    copied
                      ? "bg-green-500 text-white"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* Share Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Share via
              </label>
              <div className="flex gap-3">
                <button
                  onClick={shareViaEmail}
                  className="flex-1 py-2 px-4 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200"
                >
                  <Mail className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Email</span>
                </button>
                <button
                  onClick={shareViaTwitter}
                  className="flex-1 py-2 px-4 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200"
                >
                  <Twitter className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Twitter</span>
                </button>
                <button
                  onClick={shareViaLinkedIn}
                  className="flex-1 py-2 px-4 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200"
                >
                  <Linkedin className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">LinkedIn</span>
                </button>
              </div>
            </div>

            {/* Progress to Next Tier */}
            {nextTier && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Progress to {nextTier.tier}
                  </span>
                  <span className="text-sm text-purple-600 dark:text-purple-400">
                    {convertedReferrals.length}/{nextTier.referrals} referrals
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-500 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (convertedReferrals.length / nextTier.referrals) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  {nextTier.referrals - convertedReferrals.length} more to unlock:{" "}
                  <span className="font-medium text-purple-600 dark:text-purple-400">
                    {nextTier.reward}
                  </span>
                </p>
              </div>
            )}

            {/* How It Works */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                How It Works
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    step: 1,
                    title: "Share Your Link",
                    desc: "Send your unique referral link to friends and colleagues",
                  },
                  {
                    step: 2,
                    title: "Friends Sign Up",
                    desc: "They create an account using your link",
                  },
                  {
                    step: 3,
                    title: "Both Get Rewarded",
                    desc: "You both receive premium features when they subscribe",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 text-center"
                  >
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                      {item.step}
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "referrals" && (
          <div>
            {myReferrals.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                  No referrals yet. Share your link to get started!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myReferrals.map((referral, index) => (
                  <div
                    key={referral.id || index}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          referral.status === "converted"
                            ? "bg-green-100 text-green-600"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {referral.status === "converted" ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Share2 className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Referral #{index + 1}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {referral.convertedAt
                            ? `Converted on ${new Date(referral.convertedAt).toLocaleDateString()}`
                            : "Pending conversion"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        referral.status === "converted"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}
                    >
                      {referral.status === "converted" ? "Converted" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "rewards" && (
          <div className="space-y-4">
            {rewards.map((reward, index) => {
              const isAchieved = convertedReferrals.length >= reward.referrals;
              const isCurrent = currentTier?.tier === reward.tier;

              return (
                <div
                  key={reward.tier}
                  className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                    isAchieved
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      : "border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700"
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute -top-2 -right-2">
                      <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3" /> Current
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{reward.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {reward.tier} Tier
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {reward.referrals} successful referrals
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium ${
                          isAchieved
                            ? "text-purple-600 dark:text-purple-400"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {reward.reward}
                      </p>
                      {isAchieved && (
                        <span className="text-xs text-green-600 dark:text-green-400 flex items-center justify-end gap-1">
                          <Check className="w-3 h-3" /> Unlocked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
