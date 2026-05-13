import { X, Megaphone, Sparkles, AlertCircle, Info, Wrench } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useEntity } from "../hooks/useEntity";
import { announcementEntityConfig, announcementDismissalEntityConfig } from "../entities";
import { useAuth } from "../hooks/useAuth";
import { trackEngagement } from "../lib/ga4";

type Announcement = {
  id: number;
  title: string;
  message: string;
  type: "feature" | "update" | "maintenance" | "news" | "alert";
  priority: number;
  linkText: string;
  linkUrl: string;
  targetPages: string;
  status: "draft" | "active" | "scheduled" | "expired";
  startDate: string;
  endDate: string;
  dismissible: string;
  showOnce: string;
  icon: string;
  created_at: string;
  updated_at: string;
};

type AnnouncementDismissal = {
  id: number;
  userId: string;
  announcementId: string;
  created_at: string;
  updated_at: string;
};

const typeConfig = {
  feature: {
    icon: Sparkles,
    bgColor: "bg-gradient-to-r from-purple-500 to-pink-500",
    textColor: "text-white"
  },
  update: {
    icon: Megaphone,
    bgColor: "bg-gradient-to-r from-blue-500 to-cyan-500",
    textColor: "text-white"
  },
  maintenance: {
    icon: Wrench,
    bgColor: "bg-gradient-to-r from-orange-500 to-amber-500",
    textColor: "text-white"
  },
  news: {
    icon: Info,
    bgColor: "bg-gradient-to-r from-green-500 to-emerald-500",
    textColor: "text-white"
  },
  alert: {
    icon: AlertCircle,
    bgColor: "bg-gradient-to-r from-red-500 to-rose-500",
    textColor: "text-white"
  }
};

export function AnnouncementBanner({ currentPage = "/" }: { currentPage?: string }) {
  const { currentUser } = useAuth();
  const { items: announcements } = useEntity<Announcement>(announcementEntityConfig);
  const { items: dismissals, create: createDismissal } = useEntity<AnnouncementDismissal>(announcementDismissalEntityConfig);
  const [visibleAnnouncements, setVisibleAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    if (!announcements.length) return;

    const now = new Date();
    const filtered = announcements.filter(announcement => {
      // Check if active
      if (announcement.status !== "active") return false;

      // Check date range
      if (announcement.startDate && new Date(announcement.startDate) > now) return false;
      if (announcement.endDate && new Date(announcement.endDate) < now) return false;

      // Check target pages
      if (announcement.targetPages) {
        try {
          const pages = JSON.parse(announcement.targetPages);
          if (!pages.includes(currentPage) && !pages.includes("*")) return false;
        } catch {
          // Invalid JSON, skip this check
        }
      }

      // Check if user has dismissed
      if (currentUser && announcement.showOnce === "true") {
        const hasDismissed = dismissals.some(
          d => d.userId === String(currentUser.id) && d.announcementId === String(announcement.id)
        );
        if (hasDismissed) return false;
      }

      return true;
    });

    setVisibleAnnouncements(filtered);
  }, [announcements, dismissals, currentPage, currentUser]);

  const handleDismiss = async (announcementId: number) => {
    if (currentUser) {
      await createDismissal({
        userId: String(currentUser.id),
        announcementId: String(announcementId)
      });
      
      trackEngagement("announcement_dismissed", "announcements", String(announcementId));
    }

    setVisibleAnnouncements(prev => prev.filter(a => a.id !== announcementId));
  };

  const handleLinkClick = (announcement: Announcement) => {
    trackEngagement("announcement_link_clicked", "announcements", announcement.linkUrl);
  };

  if (visibleAnnouncements.length === 0) return null;

  return (
    <div className="space-y-2">
      {visibleAnnouncements.map(announcement => {
        const config = typeConfig[announcement.type];
        const Icon = config.icon;

        return (
          <div
            key={announcement.id}
            className={`${config.bgColor} ${config.textColor} px-4 py-3 rounded-lg shadow-md animate-fade-in`}
          >
            <div className="flex items-start gap-3">
              <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">
                      {announcement.icon && <span className="mr-2">{announcement.icon}</span>}
                      {announcement.title}
                    </h3>
                    <p className="text-sm opacity-90 leading-relaxed">
                      {announcement.message}
                    </p>
                    
                    {announcement.linkUrl && announcement.linkText && (
                      <a
                        href={announcement.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleLinkClick(announcement)}
                        className="inline-block mt-2 text-sm font-medium underline hover:no-underline transition-all"
                      >
                        {announcement.linkText} →
                      </a>
                    )}
                  </div>
                  
                  {announcement.dismissible === "true" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDismiss(announcement.id)}
                      className="text-white hover:bg-white/20 h-6 w-6 p-0 flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
