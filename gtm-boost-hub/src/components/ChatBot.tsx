import React, { useState } from "react";
import { MessageSquare, X, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message {
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

interface ContactInfo {
  email: string;
  phone: string;
}

interface DemoInfo {
  name: string;
  phone: string;
  date: string;
  time: string;
  location: string;
}

type CollectingInfoType =
  | "email"
  | "phone"
  | "name"
  | "date"
  | "time"
  | "location"
  | null;

const quickActions = [
  { text: "Schedule a Demo", action: "demo" },
  { text: "Pricing Plans", action: "pricing" },
  { text: "GTM Strategy", action: "strategy" },
  { text: "Talk to Sales", action: "sales" },
];

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "bot",
      content:
        "Hi! 👋 I'm your GTMCentric AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [collectingInfo, setCollectingInfo] =
    useState<CollectingInfoType>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: "",
    phone: "",
  });
  const [demoInfo, setDemoInfo] = useState<DemoInfo>({
    name: "",
    phone: "",
    date: "",
    time: "",
    location: "",
  });

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const validatePhone = (phone: string) => {
    // Allow international format with country codes
    // Examples: +1-234-567-8900, +44 7911 123456, +91 98765 43210
    return phone.match(/^\+?[1-9]\d{1,3}[-\s]?\d{1,14}$/);
  };

  const validateDate = (date: string) => {
    const selectedDate = new Date(date);
    const today = new Date();
    return selectedDate > today;
  };

  const validateTime = (time: string) => {
    return time.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/);
  };

  const handleQuickAction = (action: string) => {
    const userMessage =
      quickActions.find((qa) => qa.action === action)?.text || "";

    if (action === "sales") {
      setMessages((prev) => [
        ...prev,
        { type: "user", content: userMessage, timestamp: new Date() },
        {
          type: "bot",
          content:
            "I'll help you connect with our sales team. First, could you please provide your email address?",
          timestamp: new Date(),
        },
      ]);
      setCollectingInfo("email");
    } else if (action === "demo") {
      setMessages((prev) => [
        ...prev,
        { type: "user", content: userMessage, timestamp: new Date() },
        {
          type: "bot",
          content:
            "I'll help you schedule a demo. First, could you please provide your name?",
          timestamp: new Date(),
        },
      ]);
      setCollectingInfo("name");
    } else {
      setMessages((prev) => [
        ...prev,
        { type: "user", content: userMessage, timestamp: new Date() },
        {
          type: "bot",
          content: getResponseForAction(action),
          timestamp: new Date(),
        },
      ]);
    }
  };

  const getResponseForAction = (action: string): string => {
    switch (action) {
      case "pricing":
        return "We offer flexible pricing plans starting from FREE! Our most popular Pro plan is $39/month with all AI features. Would you like to know more about any specific plan?";
      case "strategy":
        return "Our AI-powered GTM Strategy Builder can help you create a customized strategy in minutes. Would you like to see how it works?";
      default:
        return "How can I assist you further?";
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    if (collectingInfo === "email") {
      if (!validateEmail(inputValue)) {
        setMessages((prev) => [
          ...prev,
          { type: "user", content: inputValue, timestamp: new Date() },
          {
            type: "bot",
            content: "Please provide a valid email address.",
            timestamp: new Date(),
          },
        ]);
      } else {
        setContactInfo((prev) => ({ ...prev, email: inputValue }));
        setMessages((prev) => [
          ...prev,
          { type: "user", content: inputValue, timestamp: new Date() },
          {
            type: "bot",
            content:
              "Great! Now, could you please provide your contact number with country code? (e.g., +1 for USA, +44 for UK, +91 for India)",
            timestamp: new Date(),
          },
        ]);
        setCollectingInfo("phone");
      }
    } else if (collectingInfo === "name") {
      setDemoInfo((prev) => ({ ...prev, name: inputValue }));
      setMessages((prev) => [
        ...prev,
        { type: "user", content: inputValue, timestamp: new Date() },
        {
          type: "bot",
          content:
            "Thanks! Could you please provide your contact number with country code? (e.g., +1 for USA, +44 for UK, +91 for India)",
          timestamp: new Date(),
        },
      ]);
      setCollectingInfo("phone");
    } else if (collectingInfo === "phone") {
      if (!validatePhone(inputValue)) {
        setMessages((prev) => [
          ...prev,
          { type: "user", content: inputValue, timestamp: new Date() },
          {
            type: "bot",
            content:
              "Please provide a valid phone number with country code (e.g., +1-234-567-8900, +44 7911 123456)",
            timestamp: new Date(),
          },
        ]);
      } else {
        if (demoInfo.name) {
          // This is for demo flow
          setDemoInfo((prev) => ({ ...prev, phone: inputValue }));
          setMessages((prev) => [
            ...prev,
            { type: "user", content: inputValue, timestamp: new Date() },
            {
              type: "bot",
              content:
                "Great! Please provide your preferred date for the demo (YYYY-MM-DD):",
              timestamp: new Date(),
            },
          ]);
          setCollectingInfo("date");
        } else {
          // This is for sales flow
          setContactInfo((prev) => ({ ...prev, phone: inputValue }));
          setMessages((prev) => [
            ...prev,
            { type: "user", content: inputValue, timestamp: new Date() },
            {
              type: "bot",
              content:
                "Thank you for providing your contact information! Our sales team will reach out to you as soon as possible. In the meantime, feel free to explore our other features or ask any questions.",
              timestamp: new Date(),
            },
          ]);
          setCollectingInfo(null);
        }
      }
    } else if (collectingInfo === "date") {
      if (!validateDate(inputValue)) {
        setMessages((prev) => [
          ...prev,
          { type: "user", content: inputValue, timestamp: new Date() },
          {
            type: "bot",
            content: "Please provide a valid future date in YYYY-MM-DD format.",
            timestamp: new Date(),
          },
        ]);
      } else {
        setDemoInfo((prev) => ({ ...prev, date: inputValue }));
        setMessages((prev) => [
          ...prev,
          { type: "user", content: inputValue, timestamp: new Date() },
          {
            type: "bot",
            content:
              "Perfect! Now, please provide your preferred time (HH:MM in 24-hour format):",
            timestamp: new Date(),
          },
        ]);
        setCollectingInfo("time");
      }
    } else if (collectingInfo === "time") {
      if (!validateTime(inputValue)) {
        setMessages((prev) => [
          ...prev,
          { type: "user", content: inputValue, timestamp: new Date() },
          {
            type: "bot",
            content: "Please provide a valid time in HH:MM format (24-hour).",
            timestamp: new Date(),
          },
        ]);
      } else {
        setDemoInfo((prev) => ({ ...prev, time: inputValue }));
        setMessages((prev) => [
          ...prev,
          { type: "user", content: inputValue, timestamp: new Date() },
          {
            type: "bot",
            content:
              "Almost done! Finally, please provide your location (city/country):",
            timestamp: new Date(),
          },
        ]);
        setCollectingInfo("location");
      }
    } else if (collectingInfo === "location") {
      setDemoInfo((prev) => ({ ...prev, location: inputValue }));
      setMessages((prev) => [
        ...prev,
        { type: "user", content: inputValue, timestamp: new Date() },
        {
          type: "bot",
          content: `Thank you for providing your demo preferences! Here's what I've got:\n\nName: ${demoInfo.name}\nPhone: ${demoInfo.phone}\nPreferred Date: ${demoInfo.date}\nPreferred Time: ${demoInfo.time}\nLocation: ${inputValue}\n\nOur sales team will review your request and get in touch with you shortly to confirm the demo schedule at a mutually convenient time. Feel free to ask any questions in the meantime!`,
          timestamp: new Date(),
        },
      ]);
      setCollectingInfo(null);
    } else {
      setMessages((prev) => [
        ...prev,
        { type: "user", content: inputValue, timestamp: new Date() },
        {
          type: "bot",
          content:
            "Thanks for your message! Our team will get back to you shortly. Meanwhile, feel free to explore our quick actions below.",
          timestamp: new Date(),
        },
      ]);
    }
    setInputValue("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <Button
        className={cn(
          "h-12 w-12 rounded-full shadow-lg relative",
          !isOpen &&
            "bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] after:absolute after:inset-0 after:rounded-full after:shadow-lg after:animate-[ping_4s_ease-in-out_infinite] after:bg-[#4F46E5]/20 after:z-[-1]",
          isOpen && "bg-gray-500 hover:bg-gray-600"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageSquare className="h-6 w-6 text-white animate-[pulse_3s_ease-in-out_infinite]" />
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-[#4F46E5] p-4 text-white flex items-center gap-2">
            <Bot className="h-6 w-6" />
            <div>
              <h3 className="font-semibold">GTMCentric Assistant</h3>
              <p className="text-xs text-white/80">
                Online | Typically replies instantly
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-2 max-w-[80%]",
                  message.type === "user" ? "ml-auto flex-row-reverse" : ""
                )}
              >
                {message.type === "bot" && (
                  <div className="h-8 w-8 rounded-full bg-[#4F46E5]/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-[#4F46E5]" />
                  </div>
                )}
                <div
                  className={cn(
                    "rounded-lg p-3 whitespace-pre-line",
                    message.type === "user"
                      ? "bg-[#4F46E5] text-white"
                      : "bg-gray-100"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.action}
                  variant="outline"
                  className="text-sm"
                  onClick={() => handleQuickAction(action.action)}
                >
                  {action.text}
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={
                  collectingInfo === "name"
                    ? "Enter your name..."
                    : collectingInfo === "phone"
                    ? "Enter your phone number..."
                    : collectingInfo === "date"
                    ? "Enter preferred date (YYYY-MM-DD)..."
                    : collectingInfo === "time"
                    ? "Enter preferred time (HH:MM)..."
                    : collectingInfo === "location"
                    ? "Enter your location (city/country)..."
                    : collectingInfo === "email"
                    ? "Enter your email address..."
                    : "Type your message..."
                }
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-[#4F46E5] hover:bg-[#4338CA]"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
