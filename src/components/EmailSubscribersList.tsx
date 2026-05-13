import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Mail, Search, Users, Loader2 } from "lucide-react";
import { useEntity } from "../hooks/useEntity";
import { emailSubscriberEntityConfig } from "../entities/EmailSubscriber";
import { emailService } from "../lib/emailService";

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

export default function EmailSubscribersList() {
  const { items: subscribers, loading } = useEntity<EmailSubscriber>(emailSubscriberEntityConfig);
  const [searchQuery, setSearchQuery] = useState("");
  const [sendingEmails, setSendingEmails] = useState<{ [key: number]: boolean }>({});

  const filteredSubscribers = subscribers.filter(
    (sub) =>
      sub.status === "active" &&
      (sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSendWelcome = async (subscriber: EmailSubscriber) => {
    setSendingEmails((prev) => ({ ...prev, [subscriber.id]: true }));
    await emailService.sendWelcomeEmail(subscriber.email, subscriber.name);
    setSendingEmails((prev) => ({ ...prev, [subscriber.id]: false }));
  };

  const activeCount = subscribers.filter((s) => s.status === "active").length;
  const unsubscribedCount = subscribers.filter((s) => s.status === "unsubscribed").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Subscribers</p>
                <p className="text-3xl font-bold">{subscribers.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-3xl font-bold text-green-600">{activeCount}</p>
              </div>
              <Mail className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Unsubscribed</p>
                <p className="text-3xl font-bold text-gray-400">{unsubscribedCount}</p>
              </div>
              <Mail className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Subscribers</CardTitle>
          <CardDescription>Manage your email subscriber list</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search subscribers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? "No subscribers found matching your search" : "No active subscribers yet"}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSubscribers.map((subscriber) => (
                <div
                  key={subscriber.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{subscriber.name || "Anonymous"}</p>
                      <Badge variant="secondary" className="text-xs">
                        {subscriber.source}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{subscriber.email}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Subscribed: {new Date(subscriber.subscribedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSendWelcome(subscriber)}
                    disabled={sendingEmails[subscriber.id]}
                  >
                    {sendingEmails[subscriber.id] ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-3 h-3 mr-1" />
                        Send Welcome
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
