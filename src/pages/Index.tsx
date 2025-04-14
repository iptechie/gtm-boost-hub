import React from "react";
import { useNavigate } from "react-router-dom";
import SignUpForm from "../components/SignUpForm";
import { Button } from "@/components/ui/button";

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 flex items-center justify-between bg-white/50 backdrop-blur-sm border-b border-slate-200">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-md bg-gtm-gradient flex items-center justify-center text-white font-bold">
            G
          </div>
          <span className="ml-2 font-bold text-xl">GTMcentric</span>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            className="text-slate-700 hover:text-gtm-blue transition-colors"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-slate-700 hover:text-gtm-blue transition-colors"
          >
            Pricing
          </a>
          <a
            href="#testimonials"
            className="text-slate-700 hover:text-gtm-blue transition-colors"
          >
            Testimonials
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="btn-outline hidden md:inline-flex"
            onClick={() => navigate("/login")}
          >
            Log in
          </Button>
          <Button className="btn-gradient" onClick={() => navigate("/signup")}>
            Start Free
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-20 flex flex-col justify-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Supercharge Your{" "}
            <span className="bg-gtm-gradient text-transparent bg-clip-text">
              Go-To-Market
            </span>{" "}
            Strategy
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-8">
            GTMcentric helps teams of all sizes align, execute, and measure
            their go-to-market strategies with AI-powered insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              className="btn-gradient text-lg py-6 px-8"
              onClick={() => navigate("/signup")}
            >
              Start Free Trial
            </Button>
            <Button
              variant="outline"
              className="btn-outline text-lg py-6 px-8"
              onClick={() => navigate("/demo-scheduling")}
            >
              Request Demo
            </Button>
          </div>
          <div className="mt-8 text-sm text-slate-500">
            No credit card required. 14-day free trial.
          </div>
        </div>

        <div
          className="w-full md:w-1/2 p-6 md:p-12 flex items-center justify-center animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="max-w-md w-full">
            <SignUpForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
