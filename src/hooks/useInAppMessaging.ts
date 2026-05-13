import { useEffect, useState } from 'react';
import { useEntity } from './useEntity';
import { inAppMessageEntityConfig, messageDisplayEntityConfig } from '../entities';

type InAppMessage = {
  id: number;
  title: string;
  content: string;
  type: 'info' | 'success' | 'warning' | 'upgrade' | 'feature' | 'tip';
  style: 'banner' | 'toast' | 'modal' | 'inline';
  priority: 'low' | 'medium' | 'high';
  triggerCondition: string;
  targetPage: string;
  ctaText?: string;
  ctaAction?: string;
  isActive: string;
  startDate?: string;
  endDate?: string;
  maxDisplays?: number;
  created_at: string;
  updated_at: string;
};

type MessageDisplay = {
  id: number;
  messageId: number;
  userId: string;
  displayCount: number;
  lastDisplayed?: string;
  dismissed: string;
  ctaClicked: string;
  created_at: string;
  updated_at: string;
};

type TriggerCondition = {
  event?: string;
  minCount?: number;
  maxCount?: number;
  userPlan?: string[];
  daysSinceSignup?: number;
  featureUsed?: string[];
  urlPattern?: string;
  timeOnPage?: number;
};

type UserContext = {
  userId: string;
  currentPage: string;
  userPlan: string;
  calculationsCount?: number;
  scenariosSaved?: number;
  comparisonsViewed?: number;
  featuresUsed?: string[];
  daysSinceSignup?: number;
  sessionDuration?: number;
};

export function useInAppMessaging(userContext: UserContext) {
  const { items: messages } = useEntity<InAppMessage>(inAppMessageEntityConfig);
  const { items: displays, create: trackDisplay, update: updateDisplay } = 
    useEntity<MessageDisplay>(messageDisplayEntityConfig);
  
  const [activeMessages, setActiveMessages] = useState<InAppMessage[]>([]);

  useEffect(() => {
    const evaluateMessages = () => {
      const now = new Date();
      const eligible: InAppMessage[] = [];

      for (const message of messages) {
        // Check if message is active
        if (message.isActive !== 'true') continue;

        // Check date range
        if (message.startDate && new Date(message.startDate) > now) continue;
        if (message.endDate && new Date(message.endDate) < now) continue;

        // Check page targeting
        if (message.targetPage !== 'all' && message.targetPage !== userContext.currentPage) continue;

        // Check display count
        const userDisplay = displays.find(
          d => d.messageId === message.id && d.userId === userContext.userId
        );

        if (userDisplay) {
          if (userDisplay.dismissed === 'true') continue;
          if (message.maxDisplays && userDisplay.displayCount >= message.maxDisplays) continue;
        }

        // Evaluate trigger conditions
        try {
          const conditions: TriggerCondition = JSON.parse(message.triggerCondition || '{}');
          
          if (conditions.userPlan && !conditions.userPlan.includes(userContext.userPlan)) continue;
          
          if (conditions.minCount !== undefined) {
            const count = userContext.calculationsCount || 0;
            if (count < conditions.minCount) continue;
          }
          
          if (conditions.maxCount !== undefined) {
            const count = userContext.calculationsCount || 0;
            if (count > conditions.maxCount) continue;
          }

          if (conditions.featureUsed && userContext.featuresUsed) {
            const hasUsedFeature = conditions.featureUsed.some(f => 
              userContext.featuresUsed?.includes(f)
            );
            if (!hasUsedFeature) continue;
          }

          if (conditions.daysSinceSignup !== undefined && userContext.daysSinceSignup !== undefined) {
            if (userContext.daysSinceSignup < conditions.daysSinceSignup) continue;
          }

          if (conditions.urlPattern) {
            const regex = new RegExp(conditions.urlPattern);
            if (!regex.test(userContext.currentPage)) continue;
          }

        } catch (e) {
          console.error('Error parsing trigger conditions:', e);
          continue;
        }

        eligible.push(message);
      }

      // Sort by priority
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      eligible.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);

      // Limit to top 3 messages to avoid overwhelming users
      setActiveMessages(eligible.slice(0, 3));
    };

    evaluateMessages();
  }, [messages, displays, userContext]);

  const recordDisplay = async (messageId: number) => {
    const existingDisplay = displays.find(
      d => d.messageId === messageId && d.userId === userContext.userId
    );

    if (existingDisplay) {
      await updateDisplay(existingDisplay.id, {
        displayCount: existingDisplay.displayCount + 1,
        lastDisplayed: new Date().toISOString(),
      });
    } else {
      await trackDisplay({
        messageId,
        userId: userContext.userId,
        displayCount: 1,
        lastDisplayed: new Date().toISOString(),
        dismissed: 'false',
        ctaClicked: 'false',
      });
    }
  };

  const dismissMessage = async (messageId: number) => {
    const existingDisplay = displays.find(
      d => d.messageId === messageId && d.userId === userContext.userId
    );

    if (existingDisplay) {
      await updateDisplay(existingDisplay.id, {
        dismissed: 'true',
      });
    }

    setActiveMessages(prev => prev.filter(m => m.id !== messageId));
  };

  const recordCTAClick = async (messageId: number) => {
    const existingDisplay = displays.find(
      d => d.messageId === messageId && d.userId === userContext.userId
    );

    if (existingDisplay) {
      await updateDisplay(existingDisplay.id, {
        ctaClicked: 'true',
      });
    }
  };

  return {
    activeMessages,
    recordDisplay,
    dismissMessage,
    recordCTAClick,
  };
}
