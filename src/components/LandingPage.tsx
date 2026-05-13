import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { 
  Calculator, 
  TrendingUp, 
  Users, 
  Shield, 
  Zap, 
  BarChart3,
  CheckCircle2,
  Star,
  ArrowRight,
  Globe,
  Lock,
  Smartphone,
  DollarSign,
  AlertTriangle,
  Target,
  Award
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6 animate-fade-in">
              <Star className="w-4 h-4 fill-blue-700" />
              <span className="text-sm font-semibold">Trusted by 10,000+ professionals</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              Lift Your Business
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                With Precision Metrics
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-up">
              The most powerful business calculator platform for professionals who demand accuracy.
              Make data-driven decisions with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
              <Button 
                size="lg" 
                onClick={onGetStarted}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={onLogin}
                className="px-8 py-6 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-300"
              >
                Sign In
              </Button>
            </div>
          </div>

          {/* Feature Preview Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="bg-white/80 backdrop-blur-sm border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-xl transform hover:scale-105">
              <CardHeader>
                <Calculator className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Advanced Calculators</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                ROI, staffing, financial projections, and scientific calculations all in one place
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-2 hover:border-indigo-300 transition-all duration-300 hover:shadow-xl transform hover:scale-105">
              <CardHeader>
                <BarChart3 className="w-12 h-12 text-indigo-600 mb-4" />
                <CardTitle>Real-Time Analytics</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Track performance metrics and gain insights with beautiful dashboards
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-2 hover:border-purple-300 transition-all duration-300 hover:shadow-xl transform hover:scale-105">
              <CardHeader>
                <Shield className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>Enterprise Security</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Bank-level encryption and GDPR compliance for your peace of mind
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Business Outcomes Section with Professional Dashboard Images */}
      <section className="py-24 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full mb-6">
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm font-semibold">Data-Driven Decisions</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-5">
              Drive Real Business Outcomes
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Make confident decisions backed by data and executive-ready insights
            </p>
          </div>

          {/* Hero Visual — Financial Growth */}
          <div className="relative mb-20 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="/images/dashboard-financial-growth.png"
                alt="Financial growth dashboard showing upward trending charts and revenue projections"
                className="w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500/90 backdrop-blur rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">Financial Growth Tracking</h3>
                </div>
                <p className="text-blue-100 text-lg max-w-xl">
                  Monitor revenue trends, forecast future performance, and visualize multi-year projections with interactive charts.
                </p>
              </div>
            </div>
          </div>

          {/* Two-Column — Accuracy & ROI */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {/* Mathematical Accuracy */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-35 transition-opacity duration-500" />
              <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <img
                  src="/images/dashboard-mathematical-accuracy.png"
                  alt="Analytics dashboard displaying mathematical precision with accuracy gauges and data tables"
                  className="w-full object-cover aspect-[4/3]"
                />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                      <Calculator className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Mathematical Precision</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Every calculation is verified for accuracy with enterprise-grade algorithms.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-600 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">99.9% calculation accuracy with audit trails</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-600 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Scenario modeling to test assumptions and edge cases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-600 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Executive summaries that speak to C-suite priorities</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ROI Performance */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-35 transition-opacity duration-500" />
              <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <img
                  src="/images/dashboard-roi-performance.png"
                  alt="ROI metrics dashboard with KPI cards, donut charts, and performance indicators"
                  className="w-full object-cover aspect-[4/3]"
                />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">ROI & Performance</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Track the metrics that matter most to your stakeholders and investors.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Real-time ROI calculations with NPV and payback periods</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">KPI dashboards showing progress toward strategic goals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Automated alerts when metrics hit critical thresholds</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: DollarSign, label: 'Avg. Cost Savings', value: '34%', color: 'from-green-500 to-emerald-600' },
              { icon: TrendingUp, label: 'Revenue Growth', value: '2.8×', color: 'from-blue-500 to-cyan-600' },
              { icon: AlertTriangle, label: 'Risk Reduction', value: '61%', color: 'from-orange-500 to-red-500' },
              { icon: Award, label: 'Client Satisfaction', value: '98%', color: 'from-purple-500 to-indigo-600' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-md`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive tools designed for modern businesses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-4 animate-fade-in-up">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of professionals making better decisions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">{testimonial.quote}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="animate-fade-in-up">
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-100 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start making better decisions today with Lift Metric
          </p>
          <Button 
            size="lg" 
            onClick={onGetStarted}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-6 text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Start Your Free Trial <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
          <p className="text-gray-500 mt-4">No credit card required • 14-day free trial</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Lift Metric</h3>
              <p className="text-gray-400">
                Empowering businesses with precision calculations and analytics
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Lift Metric. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Calculator,
    title: "Multiple Calculators",
    description: "ROI, staffing, financial projections, and scientific calculators"
  },
  {
    icon: TrendingUp,
    title: "Real-Time Analytics",
    description: "Track metrics and performance with live dashboards"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share scenarios and insights with your team"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and GDPR compliance"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Instant calculations and responsive interface"
  },
  {
    icon: BarChart3,
    title: "Advanced Reports",
    description: "Export data as PDF, CSV, or PNG for presentations"
  },
  {
    icon: Globe,
    title: "Social Sharing",
    description: "Share results on LinkedIn and X with one click"
  },
  {
    icon: Lock,
    title: "Data Privacy",
    description: "Your data is encrypted and never shared"
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Works perfectly on all devices and screen sizes"
  }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CFO, TechCorp",
    quote: "Lift Metric has transformed how we analyze ROI. The accuracy and speed are unmatched."
  },
  {
    name: "Michael Rodriguez",
    role: "Operations Manager",
    quote: "The staffing calculator alone has saved us countless hours and improved our planning significantly."
  },
  {
    name: "Emma Thompson",
    role: "Data Analyst",
    quote: "Finally, a calculator platform that understands what professionals actually need. Absolutely essential."
  }
];

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "1M+", label: "Calculations" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9★", label: "User Rating" }
];
