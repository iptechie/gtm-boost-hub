import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Smartphone,
  Zap,
  MessageSquare,
  BarChart3,
  Brain,
  Mail,
  Clock,
  Target,
  Check,
  Rocket,
  Bell,
  LineChart,
  Lightbulb,
  BadgeCheck,
  Home,
  DollarSign,
  PhoneCall,
  PlayCircle,
  MapPin,
  ArrowUp,
} from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { ChatBot } from "@/components/ChatBot";
import { GridBackground } from "@/components/ui/grid-background";
import { useNavigate, Link } from "react-router-dom";

const PAYMENT_FREQUENCIES = ["monthly", "yearly"];

const PRICING_TIERS = [
  {
    id: "starter",
    name: "Starter",
    price: {
      monthly: "FREE",
      yearly: "FREE",
    },
    description: "Perfect for trying out GTMCentric",
    features: [
      "50 Leads",
      "GTM Strategy Builder (2 times maximum)",
      "AI based Email Planner & Composer (Use 2 times maximum)",
      "Lead Management",
      "Pipeline Management",
    ],
    cta: "Get Started",
  },
  {
    id: "basic",
    name: "Basic",
    price: {
      monthly: 10,
      yearly: 8,
    },
    description: "Great for small teams",
    features: [
      "300 Leads",
      "GTM Strategy Builder (Limited)",
      "Lead Tracking",
      "Followup Notifications",
      "Pipeline Management",
      "Lead Scoring (Limited)",
      "Export Data",
    ],
    cta: "Get Started",
  },
  {
    id: "pro",
    name: "Pro",
    price: {
      monthly: 39,
      yearly: 32,
    },
    description: "Best for growing businesses",
    features: [
      "Basic +",
      "1000 Leads",
      "GTM Strategy Builder",
      "AI based Email Planner & Composer",
      "Advanced Analytics & Reports",
      "WhatsApp & Email Integration",
      "AI Insights",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: {
      monthly: "Custom",
      yearly: "Custom",
    },
    description: "For large organizations",
    features: [
      "Pro +",
      "Unlimited Leads",
      "Premium AI",
      "API Access",
      "Dedicated Support",
    ],
    cta: "Contact Sales",
    highlighted: true,
  },
];

const navItems = [
  { name: "Features", url: "#features", icon: Home },
  { name: "Pricing", url: "#pricing", icon: DollarSign },
  { name: "Demo", url: "/demo-scheduling", icon: PlayCircle },
  { name: "Contact", url: "#contact", icon: PhoneCall },
];

const LandingPage = () => {
  const [selectedFrequency, setSelectedFrequency] = useState("monthly");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <div className="flex justify-between items-center fixed top-0 left-0 right-0 z-50 px-4 h-20">
        <div className="flex items-center select-none">
          <Link to="/" className="inline-block select-none">
            <img
              src="/site-logo.png"
              alt="GTMCentric"
              className="h-24 w-auto object-contain select-none cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </Link>
          <Badge
            variant="outline"
            className="ml-2 bg-purple-100 text-purple-800 border-purple-300 font-semibold"
          >
            BETA
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-[#4F46E5]/5 hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all"
            onClick={() => navigate("/login")}
          >
            Sign in
          </Button>
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-[#4F46E5]/5 hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all"
            onClick={() => navigate("/contact-sales")}
          >
            Contact Sales
          </Button>
          <div className="relative">
            <Button
              className="bg-[#4F46E5] hover:bg-[#4338CA] text-white z-50"
              onClick={() => navigate("/signup")}
            >
              Sign Up Free
            </Button>
          </div>
        </div>
      </div>
      <NavBar items={navItems} />

      {/* Add ChatBot with adjusted position */}
      <div className="fixed bottom-4 right-8 z-30">
        <ChatBot />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-[#F8F7FF]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:35px_35px] opacity-30 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
          <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-[#4F46E5]/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#4F46E5]/10 to-transparent" />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#4F46E5]/10 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-[#7C3AED]/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-[#9333EA]/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] text-sm font-medium mb-6 animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4F46E5] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4F46E5]"></span>
                </span>
                AI-Powered GTM Platform
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#9333EA] bg-clip-text text-transparent leading-[1.2] animate-fade-in-up px-4 pb-3">
              AI-Powered GTM Platform to Accelerate Sales & Lead Management
            </h1>
            <h2 className="text-2xl text-gray-600 mb-4 animate-fade-in-up animation-delay-200">
              The Intelligent Sales Operations Platform
            </h2>
            <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
              Streamline your sales process with smart lead management and
              automation built for modern sales teams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up animation-delay-600">
              <Button
                size="lg"
                className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 py-6 text-lg group relative overflow-hidden"
                onClick={() => {
                  navigate("/signup");
                  window.scrollTo(0, 0);
                }}
              >
                <span className="relative z-10">Start Free</span>
                <ArrowRight className="ml-2 h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-[#4F46E5]/5 hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all px-8 py-6 text-lg"
                onClick={() => navigate("/demo-scheduling")}
              >
                Request Demo
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mb-16 animate-fade-in-up animation-delay-800">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                  <Check className="h-4 w-4 text-green-500" />
                </div>
                <span>AI-Powered GTM Suite</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                  <Check className="h-4 w-4 text-green-500" />
                </div>
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                  <Check className="h-4 w-4 text-green-500" />
                </div>
                <span>Enterprise-Ready Platform</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-1000">
              <div className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100">
                <div className="text-4xl font-bold text-[#7C3AED] mb-2">
                  10x
                </div>
                <div className="text-gray-600">Faster Lead Processing</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100">
                <div className="text-4xl font-bold text-[#7C3AED] mb-2">
                  50%
                </div>
                <div className="text-gray-600">Higher Conversion Rate</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100">
                <div className="text-4xl font-bold text-[#7C3AED] mb-2">
                  24/7
                </div>
                <div className="text-gray-600">AI-Powered Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-gradient-to-b from-[#F8F7FF] to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Common GTM Challenges We Solve
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We address the most pressing challenges in modern go-to-market
              strategies
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <BarChart3 className="h-8 w-8" />,
                  title: "Inconsistent Strategy",
                  description:
                    "No clear GTM strategy leading to scattered efforts and poor results.",
                  color: "from-blue-500 to-indigo-500",
                },
                {
                  icon: <Clock className="h-8 w-8" />,
                  title: "Time-Consuming Follow-ups",
                  description:
                    "Manual follow-ups eat up valuable time and often get delayed or forgotten.",
                  color: "from-amber-500 to-orange-500",
                },
                {
                  icon: <Target className="h-8 w-8" />,
                  title: "Missed Opportunities",
                  description:
                    "Important leads slip through the cracks due to lack of proper tracking.",
                  color: "from-red-500 to-pink-500",
                },
                {
                  icon: <Brain className="h-8 w-8" />,
                  title: "Lack of AI Insights",
                  description:
                    "Sales strategies lack focus without actionable insights.",
                  color: "from-purple-500 to-violet-500",
                },
              ].map((point, index) => (
                <div key={index} className="relative group h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/5 to-transparent rounded-2xl transform transition-transform duration-300 group-hover:scale-105" />
                  <div className="relative bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 group-hover:shadow-md group-hover:border-[#4F46E5]/20 h-full flex flex-col">
                    <div className="flex flex-col items-center text-center flex-grow">
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${point.color} flex items-center justify-center mb-6 transform transition-transform duration-300 group-hover:scale-110`}
                      >
                        <div className="text-white">{point.icon}</div>
                      </div>
                      <h3 className="text-xl font-semibold mb-3">
                        {point.title}
                      </h3>
                      <p className="text-gray-600">{point.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 bg-gradient-to-b from-white to-[#F8F7FF]"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              AI-Powered GTM Strategy & Lead Management Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines AI technology with proven GTM strategies to
              help you identify, engage, and convert high-value leads.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Rocket className="h-6 w-6" />,
                title: "Inbuilt GTM Strategy Builder",
                description:
                  "Just a single click to build your industry-tailored Go-To-Market strategy",
              },
              {
                icon: <Bell className="h-6 w-6" />,
                title: "Smart Follow-Ups",
                description:
                  "Seize every opportunity with automated reminders.",
              },
              {
                icon: <Target className="h-6 w-6" />,
                title: "AI-Driven Lead Scoring",
                description: "Prioritize the right leads with smart scoring.",
              },
              {
                icon: <MessageSquare className="h-6 w-6" />,
                title: "WhatsApp, Slack, Email Connect",
                description: "Connect instantly and efficiently with leads.",
              },
              {
                icon: <Mail className="h-6 w-6" />,
                title: "Craft resonated Mail with AI",
                description:
                  "Eliminate the confusion and back-and-forth hassle of drafting emails.",
              },
              {
                icon: <Lightbulb className="h-6 w-6" />,
                title: "AI Insights",
                description:
                  "AI-driven insights simplify your next move in effortlessly engaging and nurturing prospects.",
              },
              {
                icon: <Smartphone className="h-6 w-6" />,
                title: "Mobile-First",
                description: "Work seamlessly on the go.",
              },
              {
                icon: <LineChart className="h-6 w-6" />,
                title: "Visibility of Funnel",
                description:
                  "Gain a full perspective of your sales funnel, turning forecasting and decision-making into a breeze.",
              },
            ].map((feature, index) => (
              <div key={index} className="min-h-[14rem] list-none">
                <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-gray-200 p-2">
                  <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                    borderWidth={3}
                  />
                  <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-xl border-[0.75px] border-gray-200 bg-white p-6 shadow-sm">
                    <div className="relative flex flex-1 flex-col gap-2">
                      <div className="w-fit rounded-lg border-[0.75px] border-gray-200 bg-gray-50 p-2 text-blue-600">
                        {feature.icon}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl leading-[1.375rem] font-semibold tracking-[-0.04em]">
                          {feature.title}
                        </h3>
                        <p className="text-sm leading-[1.375rem] text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-[#F8F7FF] to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How GTMCentric Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform streamlines your GTM process in three simple steps
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connection Lines */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-[#4F46E5]/20 via-[#4F46E5]/40 to-[#4F46E5]/20 transform -translate-y-1/2" />

              {[
                {
                  icon: <Brain className="h-8 w-8" />,
                  title: "AI-Powered Strategy",
                  description:
                    "Our AI analyzes your industry and creates a tailored GTM strategy.",
                  color: "from-blue-500 to-indigo-500",
                },
                {
                  icon: <Zap className="h-8 w-8" />,
                  title: "Automated Follow-ups",
                  description:
                    "Smart reminders and automated follow-ups keep your pipeline moving.",
                  color: "from-indigo-500 to-purple-500",
                },
                {
                  icon: <CheckCircle2 className="h-8 w-8" />,
                  title: "Close More Deals",
                  description:
                    "With better lead management and insights, close more deals faster.",
                  color: "from-purple-500 to-pink-500",
                },
              ].map((step, index) => (
                <div key={index} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/5 to-transparent rounded-2xl transform transition-transform duration-300 group-hover:scale-105" />
                  <div className="relative bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 group-hover:shadow-md group-hover:border-[#4F46E5]/20">
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 transform transition-transform duration-300 group-hover:scale-110`}
                      >
                        <div className="text-white">{step.icon}</div>
                      </div>
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm">
                        <span className="text-[#4F46E5] font-semibold">
                          {index + 1}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="relative flex justify-center items-center w-full py-20"
      >
        <div className="absolute inset-0 -z-10">
          <div className="h-full w-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:35px_35px] opacity-30 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        </div>
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-10">
            <div className="space-y-7 text-center">
              <div className="space-y-4">
                <h2 className="text-4xl font-medium md:text-5xl">
                  Simple & Transparent Pricing
                </h2>
                <p className="text-muted-foreground">
                  Choose the best plan for your needs
                </p>
              </div>
              <div className="mx-auto flex w-fit rounded-full bg-white border border-gray-200 p-1">
                {PAYMENT_FREQUENCIES.map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setSelectedFrequency(freq)}
                    className={cn(
                      "relative px-4 py-1 text-sm font-medium capitalize transition-colors rounded-full",
                      selectedFrequency === freq
                        ? "bg-[#4F46E5] text-white"
                        : "text-gray-600 hover:text-[#4F46E5]"
                    )}
                  >
                    {freq}
                    {freq === "yearly" && (
                      <Badge
                        variant="secondary"
                        className="absolute -right-8 -top-3 text-xs"
                      >
                        -20%
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid w-full max-w-6xl gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {PRICING_TIERS.map((tier) => (
                <Card
                  key={tier.id}
                  className={cn(
                    "relative flex flex-col gap-8 overflow-hidden p-6",
                    tier.highlighted
                      ? "bg-[#4F46E5] text-white"
                      : "bg-background text-foreground",
                    tier.popular && "ring-2 ring-[#4F46E5]"
                  )}
                >
                  {tier.highlighted && (
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:45px_45px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />
                  )}
                  {tier.popular && (
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))] pointer-events-none" />
                  )}
                  {tier.id === "starter" && (
                    <div className="absolute -right-12 top-5 rotate-45 bg-emerald-500 text-white py-1 px-12 text-sm font-bold shadow-md z-10 pointer-events-none">
                      FREE
                    </div>
                  )}

                  <h3 className="flex items-center gap-3 text-xl font-medium">
                    {tier.name}
                    {tier.popular && (
                      <Badge
                        variant="secondary"
                        className="mt-1 z-10 pointer-events-none"
                      >
                        🔥 Most Popular
                      </Badge>
                    )}
                  </h3>

                  <div className="relative h-12">
                    <div className="text-4xl font-medium">
                      {typeof tier.price[selectedFrequency] === "number"
                        ? `$${tier.price[selectedFrequency]}`
                        : tier.price[selectedFrequency]}
                    </div>
                    {tier.id !== "starter" && tier.id !== "enterprise" && (
                      <Badge
                        variant="outline"
                        className={`absolute -right-1 -top-1 ${
                          tier.highlighted
                            ? "bg-white/20 text-white border-white/30"
                            : "bg-purple-100 text-purple-800 border-purple-300"
                        } font-semibold text-xs pointer-events-none`}
                      >
                        FREE IN BETA
                      </Badge>
                    )}
                    {typeof tier.price[selectedFrequency] === "number" && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Per user / month
                      </p>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <h4 className="text-sm font-medium">{tier.description}</h4>
                    <ul className="space-y-2">
                      {tier.features.map((feature, index) => (
                        <li
                          key={index}
                          className={cn(
                            "flex items-start gap-2 text-sm",
                            tier.highlighted
                              ? "text-white"
                              : "text-muted-foreground"
                          )}
                        >
                          <BadgeCheck className="h-4 w-4 mt-1 flex-shrink-0" />
                          <span className="flex-1">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    variant={tier.highlighted ? "secondary" : "default"}
                    className={cn(
                      "w-full cursor-pointer relative z-10",
                      tier.highlighted
                        ? "bg-white text-[#4F46E5] hover:bg-gray-100 pointer-events-auto"
                        : "bg-[#4F46E5] text-white hover:bg-[#4338CA] pointer-events-auto"
                    )}
                    onClick={() => {
                      console.log(
                        `Clicked ${tier.cta} button for ${tier.name} tier`
                      );
                      if (tier.cta === "Contact Sales") {
                        navigate("/contact-sales");
                      } else {
                        navigate("/signup");
                      }
                    }}
                  >
                    {tier.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background with grid pattern */}
        <GridBackground />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your GTM Strategy?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join hundreds of companies using GTMCentric to streamline their
              go-to-market strategy and close more deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="relative">
                <Button
                  className="px-8 py-4 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => {
                    navigate("/signup");
                    window.scrollTo(0, 0);
                  }}
                >
                  Start Free
                </Button>
              </div>
              <Button
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => navigate("/contact-sales")}
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-20 right-5 z-50 p-3 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-lg transition-all duration-300 ${
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <ArrowUp className="h-6 w-6" />
      </button>

      {/* Footer Section */}
      <footer className="bg-[#0A1233] pt-20 pb-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:35px_35px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
            {/* Social Media Links Column */}
            <div className="lg:col-span-4">
              <h3 className="text-white font-semibold mb-6">Connect With Us</h3>
              <div className="flex gap-6">
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#FF5B14] transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#FF5B14] transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#FF5B14] transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#FF5B14] transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-white font-semibold mb-6">Services</h3>
                <ul className="space-y-4">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-[#FF5B14] transition-colors text-sm"
                    >
                      Market Analysis
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-[#FF5B14] transition-colors text-sm"
                    >
                      Strategic Planning
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-[#FF5B14] transition-colors text-sm"
                    >
                      Customer Insights
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-[#FF5B14] transition-colors text-sm"
                    >
                      Performance Metrics
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-[#FF5B14] transition-colors text-sm"
                    >
                      Growth Acceleration
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-6">Company</h3>
                <ul className="space-y-4">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-[#FF5B14] transition-colors text-sm"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-[#FF5B14] transition-colors text-sm"
                    >
                      Team
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-[#FF5B14] transition-colors text-sm"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-[#FF5B14] transition-colors text-sm"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-[#FF5B14] transition-colors text-sm"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-6">Resources</h3>
                <ul className="space-y-4">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-[#FF5B14] transition-colors text-sm"
                    >
                      Knowledge Base
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-[#FF5B14] transition-colors text-sm"
                    >
                      Case Studies
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-[#FF5B14] transition-colors text-sm"
                    >
                      Webinars
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-[#FF5B14] transition-colors text-sm"
                    >
                      Guides
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-[#FF5B14] transition-colors text-sm"
                    >
                      Podcast
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} GTMCentric. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a
                  href="#"
                  className="text-gray-500 hover:text-[#FF5B14] transition-colors text-sm"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-[#FF5B14] transition-colors text-sm"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-[#FF5B14] transition-colors text-sm"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
