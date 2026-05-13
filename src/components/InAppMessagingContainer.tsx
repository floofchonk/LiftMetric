import { useEffect, useState } from 'react';
import { useInAppMessaging } from '../hooks/useInAppMessaging';
import InAppMessageBanner from './InAppMessageBanner';
import { useAnalytics } from '../hooks/useAnalytics';

type Props = {
  currentPage: string;
  userPlan: string;
  calculationsCount?: number;
  scenariosSaved?: number;
  comparisonsViewed?: number;
};

export default function InAppMessagingContainer({
  currentPage,
  userPlan,
  calculationsCount = 0,
  scenariosSaved = 0,
  comparisonsViewed = 0,
}: Props) {
  const [userId] = useState(() => {
    let id = localStorage.getItem('lift-metric-user-id');
    if (!id) {
      id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('lift-metric-user-id', id);
    }
    return id;
  });

  const { trackEvent } = useAnalytics();

  const { activeMessages, recordDisplay, dismissMessage, recordCTAClick } = useInAppMessaging({
    userId,
    currentPage,
    userPlan,
    calculationsCount,
    scenariosSaved,
    comparisonsViewed,
    featuresUsed: [],
    daysSinceSignup: 0,
  });

  const handleDisplay = (messageId: number) => {
    recordDisplay(messageId);
    trackEvent('message_displayed', 'engagement', {
      message_id: messageId,
      page: currentPage,
    });
  };

  const handleDismiss = (messageId: number) => {
    dismissMessage(messageId);
    trackEvent('message_dismissed', 'engagement', {
      message_id: messageId,
      page: currentPage,
    });
  };

  const handleCTAClick = (messageId: number) => {
    recordCTAClick(messageId);
    trackEvent('message_cta_clicked', 'conversion', {
      message_id: messageId,
      page: currentPage,
    });
  };

  return (
    <>
      {activeMessages.map((message) => (
        <InAppMessageBanner
          key={message.id}
          message={message}
          onDisplay={() => handleDisplay(message.id)}
          onDismiss={() => handleDismiss(message.id)}
          onCTAClick={() => handleCTAClick(message.id)}
        />
      ))}
    </>
  );
}
