import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const ContactSales: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    workEmail: "",
    phoneNumber: "",
    jobTitle: "",
    companyName: "",
    companySize: "",
    industry: "",
    region: "",
    message: "",
    acceptTerms: false,
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, acceptTerms: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success(
        "Your message has been sent! Our sales team will contact you soon."
      );
      setIsSubmitting(false);
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-radial from-blue-100 via-indigo-100 to-purple-100 text-slate-800 select-none">
      {/* Navigation */}
      <div className="flex justify-between items-center fixed top-0 left-0 right-0 z-50 px-4 h-20">
        <div className="flex items-center select-none">
          <Link to="/" className="inline-block select-none">
            <img
              src="/site-logo.png"
              alt="GTMCentric"
              className="h-24 w-auto object-contain select-none"
            />
          </Link>
          <Badge
            variant="outline"
            className="ml-2 bg-purple-100 text-purple-800 border-purple-300 font-semibold"
          >
            BETA
          </Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-32 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Talk to Our Sales Team
            </h1>
            <p className="text-lg text-slate-700 max-w-2xl mx-auto">
              Get personalized guidance on how GTMCentric can accelerate your
              go-to-market strategy
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:grid-rows-1 lg:auto-rows-fr">
            {/* Left side - Team and Why Work With Us cards */}
            <div className="space-y-8 flex flex-col justify-between h-full">
              {/* Meet Our Team Card */}
              <div className="bg-indigo-500 rounded-xl overflow-hidden relative group cursor-pointer flex-1 flex flex-col">
                {/* Team Photo with Overlay */}
                <div className="w-full flex-1 relative min-h-[240px]">
                  <img
                    src="/images/team-photo.jpg"
                    alt="Team"
                    className="w-full h-full object-cover object-center absolute inset-0"
                  />
                  {/* Overlay that fades out on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-700/80 to-indigo-600/40 transition-opacity duration-500 ease-in-out group-hover:opacity-0"></div>
                </div>

                {/* Content */}
                <div className="p-6 relative z-10 text-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm mx-auto -mt-10 shadow-lg border-2 border-white/30 transition-all duration-300 group-hover:bg-indigo-500/60 group-hover:border-white/50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mt-3 mb-2 text-white drop-shadow-md">
                    Meet Our Team
                  </h3>
                  <p className="text-sm mb-0 text-white drop-shadow-md">
                    Dedicated experts ready to help you succeed
                  </p>
                </div>
              </div>

              {/* Why Work With Us Card */}
              <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl p-8 text-slate-800 flex-1 flex flex-col justify-between shadow-md border border-white/20">
                <div>
                  <h3 className="text-xl font-bold mb-6 text-indigo-700">
                    Why Work With Us
                  </h3>

                  {/* Enterprise-Ready Solutions */}
                  <div className="flex items-center mb-6">
                    <div className="bg-indigo-100 p-3 rounded-full mr-4 shadow-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-indigo-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M7 7h10" />
                        <path d="M7 12h10" />
                        <path d="M7 17h10" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-indigo-900">
                        Enterprise-Ready Solutions
                      </h4>
                      <p className="text-sm text-slate-600">
                        Scalable platform built for businesses of all sizes
                      </p>
                    </div>
                  </div>

                  {/* Global Support */}
                  <div className="flex items-center mb-6">
                    <div className="bg-indigo-100 p-3 rounded-full mr-4 shadow-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-indigo-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        <path d="M2 12h20" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-indigo-900">
                        Global Support
                      </h4>
                      <p className="text-sm text-slate-600">
                        24/7 assistance across multiple regions and time zones
                      </p>
                    </div>
                  </div>

                  {/* Dedicated Account Manager */}
                  <div className="flex items-center">
                    <div className="bg-indigo-100 p-3 rounded-full mr-4 shadow-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-indigo-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-indigo-900">
                        Dedicated Account Manager
                      </h4>
                      <p className="text-sm text-slate-600">
                        Personal support throughout your GTMCentric journey
                      </p>
                    </div>
                  </div>
                </div>

                {/* Add a decorative element to fill the bottom space */}
                <div className="mt-6 pt-4 border-t border-indigo-100">
                  <div className="flex items-center justify-center">
                    <span className="text-xs text-indigo-400 font-medium">
                      Trusted by businesses worldwide
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Contact form */}
            <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl p-8 col-span-1 lg:col-span-2 text-slate-800 flex flex-col h-full shadow-md border border-white/20">
              <h2 className="text-2xl font-semibold mb-6 text-indigo-700">
                Contact Our Sales Team
              </h2>

              <h3 className="font-medium mb-4 text-indigo-600">
                Personal Information
              </h3>
              <form
                onSubmit={handleSubmit}
                className="space-y-6 flex-grow flex flex-col"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-indigo-800">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="Your Name"
                      className="border-indigo-100 focus-visible:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workEmail" className="text-indigo-800">
                      Work Email
                    </Label>
                    <Input
                      id="workEmail"
                      name="workEmail"
                      type="email"
                      value={formData.workEmail}
                      onChange={handleInputChange}
                      required
                      placeholder="you@company.com"
                      className="border-indigo-100 focus-visible:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-indigo-800">
                      Phone Number
                    </Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className="border-indigo-100 focus-visible:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle" className="text-indigo-800">
                      Job Title
                    </Label>
                    <Input
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      placeholder="Your Position"
                      className="border-indigo-100 focus-visible:ring-indigo-500"
                    />
                  </div>
                </div>

                <h3 className="font-medium mb-4 mt-6 text-indigo-600">
                  Company Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-indigo-800">
                      Company Name
                    </Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                      placeholder="Company Name"
                      className="border-indigo-100 focus-visible:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companySize" className="text-indigo-800">
                      Company Size
                    </Label>
                    <Select
                      value={formData.companySize}
                      onValueChange={(value) =>
                        handleSelectChange("companySize", value)
                      }
                    >
                      <SelectTrigger className="border-indigo-100 focus-visible:ring-indigo-500">
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-500">
                          201-500 employees
                        </SelectItem>
                        <SelectItem value="501-1000">
                          501-1000 employees
                        </SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-indigo-800">
                      Industry
                    </Label>
                    <Select
                      value={formData.industry}
                      onValueChange={(value) =>
                        handleSelectChange("industry", value)
                      }
                    >
                      <SelectTrigger className="border-indigo-100 focus-visible:ring-indigo-500">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="manufacturing">
                          Manufacturing
                        </SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region" className="text-indigo-800">
                      Region
                    </Label>
                    <Select
                      value={formData.region}
                      onValueChange={(value) =>
                        handleSelectChange("region", value)
                      }
                    >
                      <SelectTrigger className="border-indigo-100 focus-visible:ring-indigo-500">
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="north-america">
                          North America
                        </SelectItem>
                        <SelectItem value="south-america">
                          South America
                        </SelectItem>
                        <SelectItem value="europe">Europe</SelectItem>
                        <SelectItem value="asia-pacific">
                          Asia Pacific
                        </SelectItem>
                        <SelectItem value="middle-east">Middle East</SelectItem>
                        <SelectItem value="africa">Africa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-indigo-800">
                    How can we help?
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your specific needs and requirements..."
                    className="border-indigo-100 focus-visible:ring-indigo-500 min-h-[120px]"
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={handleCheckboxChange}
                    className="mt-1 border-indigo-200 data-[state=checked]:bg-indigo-600"
                  />
                  <Label
                    htmlFor="acceptTerms"
                    className="text-sm font-normal text-slate-700"
                  >
                    I agree to the terms and conditions
                    <br />
                    By submitting this form, you agree to our{" "}
                    <Link
                      to="/privacy"
                      className="text-indigo-600 hover:underline"
                    >
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/terms"
                      className="text-indigo-600 hover:underline"
                    >
                      Terms of Service
                    </Link>
                  </Label>
                </div>

                <div className="mt-auto pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !formData.acceptTerms}
                    className="w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-indigo-600 hover:from-purple-600 hover:via-indigo-600 hover:to-indigo-700 text-white font-medium py-3 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 rounded-lg"
                  >
                    {isSubmitting ? "Sending..." : "Get in Touch"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Professional footer spacing */}
      <div className="py-16 bg-gradient-to-t from-indigo-100/50 to-transparent mt-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-indigo-500/70">
                GTMCentric © {new Date().getFullYear()}
              </span>
              <span className="w-1 h-1 rounded-full bg-indigo-300/60"></span>
              <span className="text-xs text-indigo-500/70">
                Enterprise Solutions
              </span>
              <span className="w-1 h-1 rounded-full bg-indigo-300/60"></span>
              <span className="text-xs text-indigo-500/70">
                Privacy & Terms
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSales;
