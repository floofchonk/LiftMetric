import { useState, useEffect } from "react";
import { useEntity } from "../hooks/useEntity";
import {
  emailCampaignEntityConfig,
  userLoginTrackingEntityConfig,
  emailAutomationLogEntityConfig,
} from "../entities";
import { emailAutomation } from "../lib/emailAutomation";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Mail, Play, Pause, Clock, Users, TrendingUp, Eye } from "lucide-react";

type EmailCampaign = {
  id: number;
  name: string;
  type: "welcome" | "inactivity" | "newsletter" | "announcement" | "promotional";
  subject: string;
  templateName: string;
  triggerType: "immediate" | "scheduled" | "event-based";
  triggerCondition: string;
  status: "draft" | "active" | "paused" | "completed";
  sentCount: number;
  openRate: number;
  clickRate: number;
  lastRunAt?: string;
  createdBy?: string;
  created_at: string;
  updated_at: string;
};

type UserLoginTracking = {
  id: number;
  userId: string;
  email: string;
  username: string;
  lastLoginAt: string;
  loginCount: number;
  signupDate: string;
  isActive: string;
  inactivityEmailSent: string;
  welcomeEmailSent: string;
  lastActivityAt: string;
  created_at: string;
  updated_at: string;
};

type EmailAutomationLog = {
  id: number;
  campaignId?: number;
  campaignName: string;
  userId: string;
  email: string;
  username: string;
  emailType: string;
  subject: string;
  status: "queued" | "sent" | "failed" | "bounced";
  sentAt?: string;
  openedAt?: string;
  clickedAt?: string;
  errorMessage?: string;
  created_at: string;
  updated_at: string;
};

export default function EmailMarketingAutomation() {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    type: "welcome" as const,
    subject: "",
    templateName: "",
    triggerType: "event-based" as const,
    triggerCondition: "{}",
  });

  const {
    items: campaigns,
    loading: campaignsLoading,
    create: createCampaign,
    update: updateCampaign,
  } = useEntity<EmailCampaign>(emailCampaignEntityConfig);

  const {
    items: users,
    loading: usersLoading,
    create: createUserTracking,
    update: updateUserTracking,
  } = useEntity<UserLoginTracking>(userLoginTrackingEntityConfig);

  const { items: logs, create: createLog } =
    useEntity<EmailAutomationLog>(emailAutomationLogEntityConfig);

  // Check for inactive users and send emails
  useEffect(() => {
    const checkInactiveUsers = async () => {
      const activeCampaign = campaigns.find(
        (c) => c.type === "inactivity" && c.status === "active"
      );
      if (!activeCampaign) return;

      const inactivityThreshold = 7; // days

      for (const user of users) {
        const daysSinceLogin = user.lastLoginAt ? Math.floor((new Date().getTime() - new Date(user.lastLoginAt).getTime()) / (1000 * 60 * 60 * 24)) : 0;
          if (daysSinceLogin >= inactivityThreshold && user.inactivityEmailSent !== 'true') {

          const result = await emailAutomation.sendInactivityEmail({
            email: user.email,
            username: user.username,
            userId: user.userId,
            daysSinceLastLogin: daysSinceLogin,
          });

          if (result.success) {
            await updateUserTracking(user.id, {
              ...user,
              inactivityEmailSent: "true",
            });

            await createLog({
              campaignId: activeCampaign.id,
              campaignName: activeCampaign.name,
              userId: user.userId,
              email: user.email,
              username: user.username,
              emailType: "inactivity",
              subject: activeCampaign.subject,
              status: "sent",
              sentAt: new Date().toISOString(),
            });

            await updateCampaign(activeCampaign.id, {
              ...activeCampaign,
              sentCount: activeCampaign.sentCount + 1,
              lastRunAt: new Date().toISOString(),
            });
          }
        }
      }
    };

    const interval = setInterval(checkInactiveUsers, 60000); // Check every minute
    checkInactiveUsers(); // Run immediately

    return () => clearInterval(interval);
  }, [campaigns, users, updateUserTracking, createLog, updateCampaign]);

  const handleCreateCampaign = async () => {
    if (!newCampaign.name || !newCampaign.subject) return;

    await createCampaign({
      ...newCampaign,
      status: "draft",
      sentCount: 0,
      openRate: 0,
      clickRate: 0,
      createdBy: "admin",
    });

    setNewCampaign({
      name: "",
      type: "welcome",
      subject: "",
      templateName: "",
      triggerType: "event-based",
      triggerCondition: "{}",
    });
  };

  const toggleCampaignStatus = async (campaign: EmailCampaign) => {
    const newStatus = campaign.status === "active" ? "paused" : "active";
    await updateCampaign(campaign.id, { ...campaign, status: newStatus });
  };

  const getTotalSent = () => campaigns.reduce((sum, c) => sum + c.sentCount, 0);
  const getAvgOpenRate = () => {
    const total = campaigns.reduce((sum, c) => sum + c.openRate, 0);
    return campaigns.length > 0 ? (total / campaigns.length).toFixed(1) : "0";
  };

  const getActiveUsers = () =>
    users.filter((u) => u.isActive === "true").length;
  const getInactiveUsers = () =>
    users.filter((u) => {
      const days = u.lastLoginAt ? Math.floor((new Date().getTime() - new Date(u.lastLoginAt).getTime()) / (1000 * 60 * 60 * 24)) : 0;
      return days >= 7;
    }).length;

  if (campaignsLoading || usersLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading email automation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Email Marketing Automation
          </h1>
          <p className="text-gray-600 mt-1">
            Automated email campaigns for user engagement
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sent</p>
                <p className="text-2xl font-bold">{getTotalSent()}</p>
              </div>
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Open Rate</p>
                <p className="text-2xl font-bold">{getAvgOpenRate()}%</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">{getActiveUsers()}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive Users</p>
                <p className="text-2xl font-bold">{getInactiveUsers()}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="users">User Tracking</TabsTrigger>
          <TabsTrigger value="logs">Email Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          {/* Create Campaign */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Campaign</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Campaign Name</Label>
                  <Input
                    value={newCampaign.name}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, name: e.target.value })
                    }
                    placeholder="e.g., Welcome Series"
                  />
                </div>

                <div>
                  <Label>Campaign Type</Label>
                  <Select
                    value={newCampaign.type}
                    onValueChange={(value: any) =>
                      setNewCampaign({ ...newCampaign, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="welcome">Welcome Email</SelectItem>
                      <SelectItem value="inactivity">
                        Inactivity Reminder
                      </SelectItem>
                      <SelectItem value="newsletter">Newsletter</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="promotional">Promotional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label>Email Subject</Label>
                  <Input
                    value={newCampaign.subject}
                    onChange={(e) =>
                      setNewCampaign({
                        ...newCampaign,
                        subject: e.target.value,
                      })
                    }
                    placeholder="e.g., Welcome to Lift Metric!"
                  />
                </div>

                <div>
                  <Label>Template Name</Label>
                  <Input
                    value={newCampaign.templateName}
                    onChange={(e) =>
                      setNewCampaign({
                        ...newCampaign,
                        templateName: e.target.value,
                      })
                    }
                    placeholder="e.g., welcome-v1"
                  />
                </div>

                <div>
                  <Label>Trigger Type</Label>
                  <Select
                    value={newCampaign.triggerType}
                    onValueChange={(value: any) =>
                      setNewCampaign({ ...newCampaign, triggerType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="event-based">Event-Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleCreateCampaign} className="w-full">
                Create Campaign
              </Button>
            </CardContent>
          </Card>

          {/* Campaign List */}
          <div className="grid grid-cols-1 gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">
                          {campaign.name}
                        </h3>
                        <Badge
                          variant={
                            campaign.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {campaign.status}
                        </Badge>
                        <Badge variant="outline">{campaign.type}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {campaign.subject}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Sent: {campaign.sentCount}</span>
                        <span>Open Rate: {campaign.openRate}%</span>
                        <span>Click Rate: {campaign.clickRate}%</span>
                        {campaign.lastRunAt && (
                          <span>
                            Last Run:{" "}
                            {new Date(campaign.lastRunAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => toggleCampaignStatus(campaign)}
                      variant={
                        campaign.status === "active" ? "destructive" : "default"
                      }
                      size="sm"
                    >
                      {campaign.status === "active" ? (
                        <>
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-1" />
                          Activate
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {campaigns.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center text-gray-500">
                  No campaigns created yet. Create your first campaign above!
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Login Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.map((user) => {
                  const inactiveDays = user.lastLoginAt ? Math.floor((new Date().getTime() - new Date(user.lastLoginAt).getTime()) / (1000 * 60 * 60 * 24)) : 0;
                  const isInactive = inactiveDays >= 7;

                  return (
                    <div
                      key={user.id}
                      className={`p-4 border rounded-lg ${
                        isInactive ? "border-orange-300 bg-orange-50" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{user.username}</p>
                            <Badge
                              variant={
                                user.isActive === "true"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {user.isActive === "true"
                                ? "Active"
                                : "Inactive"}
                            </Badge>
                            {isInactive && (
                              <Badge variant="outline" className="bg-orange-100">
                                {inactiveDays} days inactive
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>Logins: {user.loginCount}</span>
                            <span>
                              Last Login:{" "}
                              {new Date(user.lastLoginAt).toLocaleDateString()}
                            </span>
                            <span>
                              Welcome Sent:{" "}
                              {user.welcomeEmailSent === "true" ? "✓" : "✗"}
                            </span>
                            <span>
                              Inactivity Sent:{" "}
                              {user.inactivityEmailSent === "true" ? "✓" : "✗"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {users.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No user tracking data yet. Users will appear here after
                    their first login.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Delivery Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {logs.slice(0, 50).map((log) => (
                  <div key={log.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge>{log.emailType}</Badge>
                          <Badge
                            variant={
                              log.status === "sent"
                                ? "default"
                                : log.status === "failed"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {log.status}
                          </Badge>
                        </div>
                        <p className="font-semibold">{log.subject}</p>
                        <p className="text-sm text-gray-600">
                          To: {log.username} ({log.email})
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {log.sentAt
                            ? `Sent: ${new Date(log.sentAt).toLocaleString()}`
                            : `Created: ${new Date(
                                log.created_at
                              ).toLocaleString()}`}
                        </p>
                        {log.errorMessage && (
                          <p className="text-sm text-red-600 mt-1">
                            Error: {log.errorMessage}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {logs.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No email logs yet. Logs will appear here when emails are
                    sent.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
