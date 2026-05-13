import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface ScenarioFeedbackProps {
  scenarioId: number;
  scenarioName: string;
  currentRating?: number;
  currentFeedback?: string;
  onSave: (rating: number, feedback: string) => void;
}

export default function ScenarioFeedback({
  scenarioName,
  currentRating = 0,
  currentFeedback = "",
  onSave,
}: ScenarioFeedbackProps) {
  const [rating, setRating] = useState(currentRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState(currentFeedback);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(rating, feedback);
    setIsEditing(false);
  };

  const displayRating = hoveredRating || rating;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Your Feedback</CardTitle>
        <CardDescription>Rate and comment on "{scenarioName}"</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => {
                  setRating(star);
                  setIsEditing(true);
                }}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= displayRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="feedback" className="text-sm font-medium mb-2 block">
            Comments (Optional)
          </label>
          <Textarea
            id="feedback"
            placeholder="Share your thoughts about this scenario..."
            value={feedback}
            onChange={(e) => {
              setFeedback(e.target.value);
              setIsEditing(true);
            }}
            rows={4}
            className="resize-none"
          />
        </div>

        {isEditing && (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              Save Feedback
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setRating(currentRating);
                setFeedback(currentFeedback);
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
          </div>
        )}

        {!isEditing && (rating > 0 || feedback) && (
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="w-full"
          >
            Edit Feedback
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
