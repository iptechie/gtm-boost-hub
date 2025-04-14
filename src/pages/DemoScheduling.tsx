import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Clock,
  Users,
  Building,
  Mail,
  Phone,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const DemoScheduling = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedTimezone, setSelectedTimezone] = useState<string>("UTC");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    attendees: "1-5",
    message: "",
  });
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
  ];

  const timezones = [
    "UTC (Coordinated Universal Time)",
    "GMT (Greenwich Mean Time)",
    "EST (Eastern Standard Time, UTC-5)",
    "CST (Central Standard Time, UTC-6)",
    "MST (Mountain Standard Time, UTC-7)",
    "PST (Pacific Standard Time, UTC-8)",
    "IST (Indian Standard Time, UTC+5:30)",
    "JST (Japan Standard Time, UTC+9)",
    "AEST (Australian Eastern Standard Time, UTC+10)",
    "CET (Central European Time, UTC+1)",
    "EET (Eastern European Time, UTC+2)",
    "ACDT (Australian Central Daylight Time, UTC+10:30)",
    "ACST (Australian Central Standard Time, UTC+9:30)",
    "ADT (Atlantic Daylight Time, UTC-3)",
    "AEDT (Australian Eastern Daylight Time, UTC+11)",
    "AFT (Afghanistan Time, UTC+4:30)",
    "AKDT (Alaska Daylight Time, UTC-8)",
    "AKST (Alaska Standard Time, UTC-9)",
    "AST (Atlantic Standard Time, UTC-4)",
    "AWDT (Australian Western Daylight Time, UTC+9)",
    "AWST (Australian Western Standard Time, UTC+8)",
    "BST (British Summer Time, UTC+1)",
    "CDT (Central Daylight Time, UTC-5)",
    "CEST (Central European Summer Time, UTC+2)",
    "EDT (Eastern Daylight Time, UTC-4)",
    "EEST (Eastern European Summer Time, UTC+3)",
    "HST (Hawaii Standard Time, UTC-10)",
    "HKT (Hong Kong Time, UTC+8)",
    "MDT (Mountain Daylight Time, UTC-6)",
    "MSK (Moscow Time, UTC+3)",
    "NZDT (New Zealand Daylight Time, UTC+13)",
    "NZST (New Zealand Standard Time, UTC+12)",
    "PDT (Pacific Daylight Time, UTC-7)",
    "SGT (Singapore Time, UTC+8)",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log({
      date,
      selectedTime,
      selectedTimezone,
      ...formData,
    });
    // Show success message or redirect
    alert("Demo scheduled successfully! We'll be in touch shortly.");
  };

  // Add a function to check if the form is valid
  const isFormValid = () => {
    return (
      date &&
      selectedTime &&
      selectedTimezone &&
      formData.name &&
      formData.email &&
      formData.company
    );
  };

  // Log form state for debugging
  useEffect(() => {
    console.log("Form state:", {
      date,
      selectedTime,
      selectedTimezone,
      formData,
      isFormValid: isFormValid(),
    });
  }, [date, selectedTime, selectedTimezone, formData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center fixed top-0 left-0 right-0 z-50 px-4 h-20">
          <div className="flex items-center select-none">
            <Link to="/" className="inline-block select-none">
              <img
                src="/site-logo.png"
                alt="GTMCentric"
                className="h-24 w-auto object-contain select-none cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/");
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
        </div>

        <div className="text-center mb-12 mt-20">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Schedule a Demo
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            See how GTMCentric can transform your go-to-market strategy. Select
            a date and time that works for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar and Time Selection */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Select Date & Time</CardTitle>
                <CardDescription>
                  Choose when you'd like to have your demo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) =>
                          date < new Date() ||
                          date >
                            new Date(
                              new Date().setMonth(new Date().getMonth() + 2)
                            )
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select
                    value={selectedTimezone}
                    onValueChange={setSelectedTimezone}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your timezone" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      {timezones.map((timezone) => (
                        <SelectItem key={timezone} value={timezone}>
                          {timezone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Time</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-indigo-50 rounded-lg font-roboto">
                  <h3 className="font-medium text-indigo-800 mb-2">
                    What to expect:
                  </h3>
                  <ul className="space-y-2 text-sm text-indigo-700">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>30-minute personalized demo of GTMCentric</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Q&A session with our product experts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Customized recommendations for your business</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
                <CardDescription>
                  Fill in your details to confirm the demo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        className="pl-10"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="company"
                        name="company"
                        placeholder="Your company"
                        className="pl-10"
                        value={formData.company}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Your phone number"
                        className="pl-10"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="attendees">Number of Attendees</Label>
                    <Select
                      value={formData.attendees}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, attendees: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of attendees" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-5">1-5 people</SelectItem>
                        <SelectItem value="6-10">6-10 people</SelectItem>
                        <SelectItem value="11-20">11-20 people</SelectItem>
                        <SelectItem value="20+">20+ people</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Additional Information</Label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Any specific questions or requirements?"
                        className="pl-10 min-h-[100px]"
                        value={formData.message}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    disabled={!isFormValid()}
                  >
                    Schedule Demo
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoScheduling;
