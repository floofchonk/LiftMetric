import { Sparkles } from "lucide-react";
import { Button } from "./ui/button";

type OnboardingTriggerButtonProps = {
  onClick: () => void;
};

export default function OnboardingTriggerButton({ onClick }: OnboardingTriggerButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="flex items-center gap-2"
    >
      <Sparkles className="w-4 h-4" />
      Take Tour
    </Button>
  );
}
