import { useState } from "react";
import { Search, BookOpen, Video, MessageCircle, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useEntity } from "../hooks/useEntity";
import { helpArticleEntityConfig, helpContactEntityConfig } from "../entities";
import { useAuth } from "../hooks/useAuth";
import { trackHelpArticle, trackFormSubmission, trackSearch } from "../lib/ga4";

type HelpArticle = {
  id: number;
  title: string;
  slug: string;
  category: string;
  content: string;
  excerpt: string;
  videoUrl: string;
  tags: string;
  views: number;
  helpful: number;
  notHelpful: number;
  featured: string;
  published: string;
  created_at: string;
  updated_at: string;
};

type HelpContact = {
  id: number;
  userId: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
};

const categories = [
  { id: "getting-started", name: "Getting Started", icon: "🚀" },
  { id: "basic-mode", name: "Basic Mode", icon: "📊" },
  { id: "scientific-mode", name: "Scientific Mode", icon: "🔬" },
  { id: "history", name: "History Panel", icon: "📜" },
  { id: "reports", name: "Reports & Export", icon: "📄" },
  { id: "advanced-features", name: "Advanced Features", icon: "⚡" },
];

const defaultArticles = [
  {
    title: "Getting Started with Lift Metric",
    slug: "getting-started",
    category: "getting-started",
    excerpt: "Learn the basics of Lift Metric and how to create your first calculation.",
    content: `# Getting Started with Lift Metric

Welcome to Lift Metric! This guide will help you get started with calculating ROI for your projects.

## Quick Start
1. Choose between Basic and Scientific calculation modes
2. Enter your project details (size, timeline, budget)
3. Add cost models and ROI inputs
4. Generate comprehensive reports

## Basic vs Scientific Mode
- **Basic Mode**: Quick calculations for standard projects
- **Scientific Mode**: Advanced metrics including NPV, IRR, and payback period

## Need Help?
Browse our FAQ section or contact support for assistance.`,
    videoUrl: "",
    tags: "getting started, basics, introduction, tutorial",
    featured: "true",
  },
  {
    title: "Understanding Basic Mode Calculations",
    slug: "basic-mode-calculations",
    category: "basic-mode",
    excerpt: "Learn how to use Basic Mode for quick ROI calculations.",
    content: `# Basic Mode Calculations

Basic Mode is perfect for quick ROI estimates and standard project calculations.

## What You'll Need
- Project size (duration estimate)
- Team composition
- Budget information
- Expected benefits

## Step-by-Step Guide
1. Select project size from dropdown
2. Choose risk profile and priority
3. Enter team details and locations
4. Add expected benefits and costs
5. Click Calculate Results

## Understanding Results
Your results will show:
- Total ROI percentage
- Net present value
- Break-even timeline
- Cost breakdown by category`,
    videoUrl: "",
    tags: "basic mode, calculations, roi, quick start",
    featured: "true",
  },
  {
    title: "Advanced Scientific Mode Features",
    slug: "scientific-mode-features",
    category: "scientific-mode",
    excerpt: "Explore advanced metrics like IRR, NPV, and sensitivity analysis.",
    content: `# Scientific Mode Features

Scientific Mode provides enterprise-grade financial analysis tools.

## Advanced Metrics
- **Internal Rate of Return (IRR)**: Measures investment efficiency
- **Net Present Value (NPV)**: Time-adjusted value calculation
- **Payback Period**: Time to recover initial investment
- **Sensitivity Analysis**: Risk assessment across scenarios

## When to Use Scientific Mode
- Large enterprise projects (>$1M budget)
- Long-term investments (>12 months)
- Multiple stakeholder presentations
- Detailed financial reporting requirements

## Customization Options
- Adjust discount rates
- Modify complexity factors
- Set custom risk profiles
- Configure alert thresholds`,
    videoUrl: "",
    tags: "scientific mode, irr, npv, advanced metrics, enterprise",
    featured: "true",
  },
  {
    title: "Using the History Panel",
    slug: "history-panel-guide",
    category: "history",
    excerpt: "Track and compare your previous calculations with the History Panel.",
    content: `# History Panel Guide

The History Panel helps you track and compare all your calculations.

## Accessing History
Click the History icon in the navigation to view all past calculations.

## Features
- **Search & Filter**: Find calculations by name, date, or project
- **Quick Compare**: Select multiple scenarios to compare
- **Export History**: Download calculation history as CSV/Excel
- **Restore Scenarios**: Load any previous calculation instantly

## Best Practices
- Name your scenarios descriptively
- Use tags for easy filtering
- Review history before starting similar projects
- Archive old calculations to keep workspace clean`,
    videoUrl: "",
    tags: "history, scenarios, comparison, tracking",
    featured: "false",
  },
  {
    title: "Generating Professional Reports",
    slug: "generating-reports",
    category: "reports",
    excerpt: "Create custom branded reports for stakeholders and executives.",
    content: `# Generating Professional Reports

Create polished reports ready for executive presentations.

## Report Types
1. **Executive Summary**: High-level overview with key metrics
2. **Detailed Analysis**: Complete breakdown with charts
3. **Comparison Report**: Side-by-side scenario analysis
4. **Custom Report**: Choose specific sections and metrics

## Customization Options
- Add company logo and branding
- Choose color themes
- Select which metrics to include
- Add custom notes and commentary

## Export Formats
- PDF for presentations
- Excel for detailed analysis
- CSV for data integration
- PowerPoint slides (coming soon)

## Tips for Better Reports
- Include executive summary on first page
- Use charts for visual impact
- Highlight key decision points
- Add comparison to industry benchmarks`,
    videoUrl: "",
    tags: "reports, export, pdf, excel, presentation",
    featured: "true",
  },
  {
    title: "Setting Up Email Alerts",
    slug: "email-alerts-setup",
    category: "advanced-features",
    excerpt: "Configure alerts to notify you when ROI thresholds are met.",
    content: `# Email Alerts Setup

Stay informed with automated ROI threshold alerts.

## Creating Alerts
1. Navigate to Alerts Manager
2. Click "Create Alert"
3. Set ROI threshold (e.g., 150%)
4. Choose notification preferences
5. Save and activate

## Alert Types
- **Threshold Alerts**: Triggered when ROI reaches target
- **Timeline Alerts**: Notify at specific project milestones
- **Budget Alerts**: Warning when costs exceed projections
- **Report Alerts**: Scheduled report delivery

## Managing Notifications
- Customize email frequency
- Set quiet hours
- Choose which alerts to receive
- Manage multiple alert profiles`,
    videoUrl: "",
    tags: "alerts, notifications, email, thresholds, automation",
    featured: "false",
  },
];

export default function HelpCenter() {
  const { currentUser } = useAuth();
  const { items: articles, loading: articlesLoading, create: createArticle, update: updateArticle } = useEntity<HelpArticle>(helpArticleEntityConfig);
  const { create: createContact } = useEntity<HelpContact>(helpContactEntityConfig);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null);
  const [votedArticles, setVotedArticles] = useState<Set<number>>(new Set());

  // Initialize default articles if none exist
  const initializeArticles = async () => {
    if (articles.length === 0 && !articlesLoading) {
      for (const article of defaultArticles) {
        await createArticle({
          ...article,
          views: 0,
          helpful: 0,
          notHelpful: 0,
          published: "true",
        });
      }
    }
  };

  // Call initialization
  if (articles.length === 0 && !articlesLoading) {
    initializeArticles();
  }

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: currentUser?.email?.split("@")[0] || "",
    email: currentUser?.email || "",
    subject: "",
    message: "",
    category: "general" as const,
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Filter articles
  const filteredArticles = articles.filter((article) => {
    const matchesSearch = 
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory && article.published === "true";
  });

  const featuredArticles = filteredArticles.filter((a) => a.featured === "true").slice(0, 3);

  const handleVote = async (articleId: number, isHelpful: boolean) => {
    if (votedArticles.has(articleId)) return;

    const article = articles.find((a) => a.id === articleId);
    if (!article) return;

    trackHelpArticle(articleId, article.title);

    await updateArticle(articleId, {
      helpful: isHelpful ? article.helpful + 1 : article.helpful,
      notHelpful: !isHelpful ? article.notHelpful + 1 : article.notHelpful,
    });

    setVotedArticles(new Set([...votedArticles, articleId]));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createContact({
      userId: Number(currentUser?.id) || 0,
      ...contactForm,
      status: "new",
      priority: "medium",
    });
    trackFormSubmission("help_contact");
    setContactSubmitted(true);
    setContactForm({
      name: currentUser?.email?.split("@")[0] || "",
      email: currentUser?.email || "",
      subject: "",
      message: "",
      category: "general",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Help Center</h1>
            <p className="text-xl text-blue-100 mb-8">
              Find answers, tutorials, and guides to get the most out of Lift Metric
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for help articles, guides, or tutorials..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.length > 2) {
                    trackSearch(e.target.value, "help_center");
                  }
                }}
                className="pl-12 py-6 text-lg bg-white text-gray-900"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="articles" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="articles">
              <BookOpen className="w-4 h-4 mr-2" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="tutorials">
              <Video className="w-4 h-4 mr-2" />
              Tutorials
            </TabsTrigger>
            <TabsTrigger value="contact">
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Us
            </TabsTrigger>
          </TabsList>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-8">
            {/* Featured Articles */}
            {featuredArticles.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Featured Articles</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {featuredArticles.map((article) => (
                    <Card key={article.id} className="hover:shadow-lg transition-shadow duration-200">
                      <CardHeader>
                        <Badge className="w-fit mb-2">
                          {categories.find((c) => c.id === article.category)?.icon}{" "}
                          {categories.find((c) => c.id === article.category)?.name}
                        </Badge>
                        <CardTitle className="text-lg">{article.title}</CardTitle>
                        <CardDescription>{article.excerpt}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="ghost"
                          className="w-full"
                          onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                        >
                          Read Article
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Categories */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Browse by Category</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("all")}
                >
                  All Articles
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.icon} {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Article List */}
            <div className="space-y-4">
              {filteredArticles.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No articles found matching your search.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow duration-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">
                              {categories.find((c) => c.id === article.category)?.icon}{" "}
                              {categories.find((c) => c.id === article.category)?.name}
                            </Badge>
                            <span className="text-sm text-gray-500">{article.views} views</span>
                          </div>
                          <CardTitle className="text-xl cursor-pointer hover:text-blue-600" onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}>
                            {article.title}
                          </CardTitle>
                          <CardDescription className="mt-2">{article.excerpt}</CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                        >
                          {expandedArticle === article.id ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>

                    {expandedArticle === article.id && (
                      <CardContent className="border-t pt-6">
                        <div className="prose max-w-none mb-6">
                          {article.content.split("\n").map((line, idx) => {
                            if (line.startsWith("# ")) {
                              return <h1 key={idx} className="text-3xl font-bold mb-4">{line.replace("# ", "")}</h1>;
                            } else if (line.startsWith("## ")) {
                              return <h2 key={idx} className="text-2xl font-semibold mb-3 mt-6">{line.replace("## ", "")}</h2>;
                            } else if (line.startsWith("- **")) {
                              const match = line.match(/- \*\*(.+?)\*\*: (.+)/);
                              if (match) {
                                return <li key={idx} className="ml-6 mb-2"><strong>{match[1]}</strong>: {match[2]}</li>;
                              }
                            } else if (line.startsWith("- ")) {
                              return <li key={idx} className="ml-6 mb-2">{line.replace("- ", "")}</li>;
                            } else if (line.match(/^\d+\. /)) {
                              return <li key={idx} className="ml-6 mb-2">{line.replace(/^\d+\. /, "")}</li>;
                            } else if (line.trim() !== "") {
                              return <p key={idx} className="mb-4">{line}</p>;
                            }
                            return null;
                          })}
                        </div>

                        {/* Voting */}
                        <div className="flex items-center gap-4 pt-4 border-t">
                          <span className="text-sm text-gray-600">Was this article helpful?</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVote(article.id, true)}
                            disabled={votedArticles.has(article.id)}
                            className="gap-2"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            Yes ({article.helpful})
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVote(article.id, false)}
                            disabled={votedArticles.has(article.id)}
                            className="gap-2"
                          >
                            <ThumbsDown className="w-4 h-4" />
                            No ({article.notHelpful})
                          </Button>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Tutorials Tab */}
          <TabsContent value="tutorials" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Video className="w-8 h-8 text-blue-600" />
                    <CardTitle>Basic Mode Tutorial</CardTitle>
                  </div>
                  <CardDescription>
                    5-minute walkthrough of creating your first calculation in Basic Mode
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                    <Video className="w-16 h-16 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Topics covered:</p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Choosing project parameters</li>
                      <li>• Adding team members and costs</li>
                      <li>• Interpreting results</li>
                      <li>• Exporting reports</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Video className="w-8 h-8 text-indigo-600" />
                    <CardTitle>Scientific Mode Deep Dive</CardTitle>
                  </div>
                  <CardDescription>
                    15-minute comprehensive guide to advanced financial metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                    <Video className="w-16 h-16 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Topics covered:</p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Understanding NPV and IRR</li>
                      <li>• Sensitivity analysis</li>
                      <li>• Custom discount rates</li>
                      <li>• Scenario comparison</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Video className="w-8 h-8 text-green-600" />
                    <CardTitle>History Panel Mastery</CardTitle>
                  </div>
                  <CardDescription>
                    Learn to track and compare multiple scenarios effectively
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                    <Video className="w-16 h-16 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Topics covered:</p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Saving and organizing scenarios</li>
                      <li>• Quick comparison tools</li>
                      <li>• Filtering and search</li>
                      <li>• Export history data</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Video className="w-8 h-8 text-purple-600" />
                    <CardTitle>Report Generation Guide</CardTitle>
                  </div>
                  <CardDescription>
                    Create professional reports for stakeholders and executives
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                    <Video className="w-16 h-16 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Topics covered:</p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Report customization options</li>
                      <li>• Adding branding and logos</li>
                      <li>• Choosing metrics to display</li>
                      <li>• Export formats (PDF, Excel)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>
                  Can't find what you're looking for? Send us a message and we'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {contactSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-gray-600 mb-4">
                      We've received your message and will respond within 24 hours.
                    </p>
                    <Button onClick={() => setContactSubmitted(false)}>Send Another Message</Button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={contactForm.category}
                        onValueChange={(value) => setContactForm({ ...contactForm, category: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="billing">Billing Question</SelectItem>
                          <SelectItem value="feature-request">Feature Request</SelectItem>
                          <SelectItem value="general">General Inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        rows={6}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <BookOpen className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold mb-2">Documentation</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Browse our complete documentation and API reference
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Docs
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <MessageCircle className="w-8 h-8 text-indigo-600 mb-3" />
                  <h3 className="font-semibold mb-2">Community Forum</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Join discussions with other Lift Metric users
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Visit Forum
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <ExternalLink className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="font-semibold mb-2">Status Page</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Check system status and uptime information
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Status
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
