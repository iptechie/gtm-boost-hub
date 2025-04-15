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
import { submitContactSalesForm } from "@/lib/supabase";

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

    try {
      // Submit the form data to Supabase
      const { error } = await submitContactSalesForm({
        fullName: formData.fullName,
        workEmail: formData.workEmail,
        phoneNumber: formData.phoneNumber,
        jobTitle: formData.jobTitle,
        companyName: formData.companyName,
        companySize: formData.companySize,
        industry: formData.industry,
        region: formData.region,
        message: formData.message,
      });

      if (error) {
        throw error;
      }

      toast.success(
        "Your message has been sent! Our sales team will contact you soon."
      );
      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-radial from-blue-100 via-indigo-100 to-purple-100 text-slate-800 select-none">
      {/* Navigation */}
      <div className="flex justify-between items-center fixed top-0 left-0 right-0 z-50 px-4 h-16 sm:h-20 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center select-none">
          <Link to="/" className="inline-block select-none">
            <img
              src="/site-logo.png"
              alt="GTMCentric"
              className="h-16 sm:h-20 md:h-24 w-auto object-contain select-none cursor-pointer"
            />
          </Link>
          <Badge
            variant="outline"
            className="ml-2 -mt-6 sm:-mt-8 md:-mt-10 bg-purple-100 text-purple-800 border-purple-300 font-semibold"
          >
            BETA
          </Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-24 sm:pt-28 md:pt-32 pb-6 sm:pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Talk to Our Sales Team
            </h1>
            <p className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto">
              Get personalized guidance on how GTMCentric can accelerate your
              go-to-market strategy
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:grid-rows-1 lg:auto-rows-fr">
            {/* Left side - Team and Why Work With Us cards */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8 flex flex-col justify-between h-full">
              {/* Meet Our Team Card */}
              <div className="bg-indigo-500 rounded-xl overflow-hidden relative group cursor-pointer flex-1 flex flex-col">
                {/* Team Photo with Overlay */}
                <div className="w-full flex-1 relative min-h-[200px] sm:min-h-[240px]">
                  <img
                    src="/images/team-photo.jpg"
                    alt="Team"
                    className="w-full h-full object-cover object-center absolute inset-0"
                  />
                  {/* Overlay that fades out on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-700/80 to-indigo-600/40 transition-opacity duration-500 ease-in-out group-hover:opacity-0"></div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 relative z-10 text-center">
                  <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/30 backdrop-blur-sm mx-auto -mt-8 sm:-mt-10 shadow-lg border-2 border-white/30 transition-all duration-300 group-hover:bg-indigo-500/60 group-hover:border-white/50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 sm:h-8 sm:w-8 text-white"
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
                  <h3 className="text-lg sm:text-xl font-bold mt-2 sm:mt-3 mb-1 sm:mb-2 text-white drop-shadow-md">
                    Meet Our Team
                  </h3>
                  <p className="text-xs sm:text-sm mb-0 text-white drop-shadow-md">
                    Dedicated experts ready to help you succeed
                  </p>
                </div>
              </div>

              {/* Why Work With Us Card */}
              <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl p-4 sm:p-6 md:p-8 text-slate-800 flex-1 flex flex-col justify-between shadow-md border border-white/20">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-indigo-700">
                    Why Work With Us
                  </h3>

                  {/* Enterprise-Ready Solutions */}
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="bg-indigo-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 shadow-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600"
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
                      <h4 className="text-sm sm:text-base font-medium text-indigo-900">
                        Enterprise-Ready Solutions
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600">
                        Scalable platform built for businesses of all sizes
                      </p>
                    </div>
                  </div>

                  {/* Global Support */}
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="bg-indigo-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 shadow-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600"
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
                      <h4 className="text-sm sm:text-base font-medium text-indigo-900">
                        Global Support
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600">
                        24/7 assistance across multiple regions and time zones
                      </p>
                    </div>
                  </div>

                  {/* Dedicated Account Manager */}
                  <div className="flex items-center">
                    <div className="bg-indigo-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 shadow-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600"
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
                      <h4 className="text-sm sm:text-base font-medium text-indigo-900">
                        Dedicated Account Manager
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600">
                        Personalized support throughout your GTMCentric journey
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border border-white/50">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-slate-800">
                  Contact Our Sales Team
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="fullName"
                        className="text-sm sm:text-base text-slate-700"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        placeholder="Your name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="bg-white/80 border-slate-300"
                      />
                    </div>
                    {/* Work Email */}
                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="workEmail"
                        className="text-sm sm:text-base text-slate-700"
                      >
                        Work Email
                      </Label>
                      <Input
                        id="workEmail"
                        name="workEmail"
                        type="email"
                        placeholder="you@company.com"
                        value={formData.workEmail}
                        onChange={handleInputChange}
                        required
                        className="bg-white/80 border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Job Title */}
                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="jobTitle"
                        className="text-sm sm:text-base text-slate-700"
                      >
                        Job Title
                      </Label>
                      <Input
                        id="jobTitle"
                        name="jobTitle"
                        placeholder="Your role"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        required
                        className="bg-white/80 border-slate-300"
                      />
                    </div>
                    {/* Phone Number */}
                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="phoneNumber"
                        className="text-sm sm:text-base text-slate-700"
                      >
                        Phone Number
                      </Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        placeholder="Your phone number"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="bg-white/80 border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Company Name */}
                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="companyName"
                        className="text-sm sm:text-base text-slate-700"
                      >
                        Company Name
                      </Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        placeholder="Your company"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        required
                        className="bg-white/80 border-slate-300"
                      />
                    </div>
                    {/* Company Size */}
                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="companySize"
                        className="text-sm sm:text-base text-slate-700"
                      >
                        Company Size
                      </Label>
                      <Select
                        value={formData.companySize}
                        onValueChange={(value) =>
                          handleSelectChange("companySize", value)
                        }
                      >
                        <SelectTrigger
                          id="companySize"
                          className="bg-white/80 border-slate-300"
                        >
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">
                            51-200 employees
                          </SelectItem>
                          <SelectItem value="201-500">
                            201-500 employees
                          </SelectItem>
                          <SelectItem value="501-1000">
                            501-1000 employees
                          </SelectItem>
                          <SelectItem value="1001+">1001+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Industry */}
                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="industry"
                        className="text-sm sm:text-base text-slate-700"
                      >
                        Industry
                      </Label>
                      <Select
                        value={formData.industry}
                        onValueChange={(value) =>
                          handleSelectChange("industry", value)
                        }
                      >
                        <SelectTrigger
                          id="industry"
                          className="bg-white/80 border-slate-300"
                        >
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="manufacturing">
                            Manufacturing
                          </SelectItem>
                          <SelectItem value="professional_services">
                            Professional Services
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Region */}
                    <div className="space-y-1 sm:space-y-2">
                      <Label
                        htmlFor="region"
                        className="text-sm sm:text-base text-slate-700"
                      >
                        Region
                      </Label>
                      <Select
                        value={formData.region}
                        onValueChange={(value) =>
                          handleSelectChange("region", value)
                        }
                      >
                        <SelectTrigger
                          id="region"
                          className="bg-white/80 border-slate-300"
                        >
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="north_america">
                            North America
                          </SelectItem>
                          <SelectItem value="south_america">
                            South America
                          </SelectItem>
                          <SelectItem value="europe">Europe</SelectItem>
                          <SelectItem value="asia_pacific">
                            Asia Pacific
                          </SelectItem>
                          <SelectItem value="middle_east">
                            Middle East & Africa
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1 sm:space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-sm sm:text-base text-slate-700"
                    >
                      How can we help?
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your specific needs and questions"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="h-24 sm:h-32 bg-white/80 border-slate-300"
                      required
                    />
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={handleCheckboxChange}
                      className="mt-1"
                      required
                    />
                    <Label
                      htmlFor="acceptTerms"
                      className="text-xs sm:text-sm text-slate-600 font-normal"
                    >
                      I agree to GTMCentric's{" "}
                      <a
                        href="#"
                        className="text-indigo-600 hover:text-indigo-800 underline"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-indigo-600 hover:text-indigo-800 underline"
                      >
                        Privacy Policy
                      </a>
                      . GTMCentric will process your data to provide you with
                      information about our products and services.
                    </Label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || !formData.acceptTerms}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 mt-2 sm:mt-4"
                  >
                    {isSubmitting ? "Sending..." : "Get in Touch"}
                  </Button>
                </form>
              </div>
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
