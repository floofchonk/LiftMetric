import { Star, MessageSquare } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

interface ScenarioCardProps {
  scenario: {
    id: number;
    name: string;
    companySize: string;
    industry: string;
    projectScope: string;
    rating?: number;
    feedback?: string;
  };
  onViewFeedback: (scenarioId: number) => void;
  children?: React.ReactNode;
}

export default function ScenarioCard({ scenario, onViewFeedback, children }: ScenarioCardProps) {
  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
      {children}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="font-semibold">{scenario.name}</div>
          {scenario.rating && scenario.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{scenario.rating}</span>
            </div>
          )}
        </div>
        <div className="text-sm text-gray-600">
          {scenario.industry} • {scenario.companySize} • {scenario.projectScope}
        </div>
        {scenario.feedback && (
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
            <MessageSquare className="h-3 w-3" />
            <span className="truncate max-w-xs">{scenario.feedback}</span>
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewFeedback(scenario.id)}
        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
      >
        {scenario.rating || scenario.feedback ? "Edit Feedback" : "Add Feedback"}
      </Button>
    </div>
  );
}
