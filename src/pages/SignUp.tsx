import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Provider } from "@supabase/supabase-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import SubscriptionSelector from "@/components/SubscriptionSelector";
import { SUBSCRIPTION_PLANS } from "@/types/subscription";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { signUpWithEmail, signInWithProvider } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/Logo";

// Password strength indicator component
const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  const getStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength(password);
  const strengthText =
    ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"][strength - 1] ||
    "Very Weak";
  const strengthColor =
    [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-green-600",
    ][strength - 1] || "bg-red-500";

  return (
    <div className="mt-1">
      <div className="flex gap-1 h-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={cn(
              "flex-1 rounded-full",
              level <= strength ? strengthColor : "bg-gray-200"
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Strength: {strengthText}
      </p>
    </div>
  );
};

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    organizationName: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));

    // Clear error when user checks the box
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleEmailSignUp = async (userType: "single" | "company") => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await signUpWithEmail(
        formData.email,
        formData.password,
        userType,
        {
          name: formData.name,
          organizationName: formData.organizationName,
        }
      );

      if (error) throw error;

      setUserEmail(formData.email);
      setShowVerificationMessage(true);
    } catch (error) {
      toast.error("Error signing up. Please try again.");
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProviderSignUp = async (provider: Provider) => {
    setIsLoading(true);
    try {
      const { error } = await signInWithProvider(provider);
      if (error) throw error;
    } catch (error) {
      toast.error(`Error signing in with ${provider}. Please try again.`);
      console.error(`${provider} sign in error:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  if (showVerificationMessage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Logo />
        </div>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-center">
              We've sent a verification link to:
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg font-medium mb-4">{userEmail}</p>
            <p className="text-sm text-gray-600 mb-6">
              Please click the verification link in your email to complete your
              registration. Once verified, you'll be automatically redirected to
              select your subscription.
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Didn't receive the email? Click to try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center space-y-4 w-full max-w-md">
        <Card className="w-full shadow-lg border-gray-200">
          <CardHeader className="flex flex-col items-center pt-8 pb-4">
            <div className="mb-3 select-none flex items-center">
              <Link to="/" className="inline-block select-none">
                <img
                  src="/site-logo.png"
                  alt="GTMCentric"
                  className="h-24 w-auto object-contain select-none"
                />
              </Link>
              <Badge
                variant="outline"
                className="ml-2 -mt-10 bg-purple-100 text-purple-800 border-purple-300 font-semibold"
              >
                BETA
              </Badge>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              Create your GTMCentric Account
            </CardTitle>
            <CardDescription className="text-center text-gray-500 mt-1">
              Choose how you want to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <Tabs defaultValue="single" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="single" className="text-sm font-medium">
                  Single User
                </TabsTrigger>
                <TabsTrigger value="company" className="text-sm font-medium">
                  Company
                </TabsTrigger>
              </TabsList>
              <TabsContent value="single">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEmailSignUp("single");
                  }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                      className="border-gray-300 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-gray-700 font-medium"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your email"
                      className="border-gray-300 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-gray-700 font-medium"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        placeholder="Create a password"
                        className="border-gray-300 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                    <PasswordStrengthIndicator password={formData.password} />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-gray-700 font-medium"
                    >
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      placeholder="Confirm your password"
                      className="border-gray-300 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                    />
                  </div>
                  <div className="flex items-start space-x-2 mt-4">
                    <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("acceptTerms", checked as boolean)
                      }
                      className="mt-1 border-gray-300 text-[#4F46E5] focus:ring-[#4F46E5]"
                    />
                    <Label
                      htmlFor="acceptTerms"
                      className="text-sm text-gray-600 font-normal"
                    >
                      I agree to the{" "}
                      <a
                        href="/terms"
                        className="text-[#4F46E5] hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="/privacy"
                        className="text-[#4F46E5] hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Privacy Policy
                      </a>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !formData.acceptTerms}
                    className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium py-2 mt-6"
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="company">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEmailSignUp("company");
                  }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="organizationName"
                      className="text-gray-700 font-medium"
                    >
                      Organization Name
                    </Label>
                    <Input
                      id="organizationName"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your organization name"
                      className="border-gray-300 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                      className="border-gray-300 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-gray-700 font-medium"
                    >
                      Work Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your work email"
                      className="border-gray-300 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-gray-700 font-medium"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        placeholder="Create a password"
                        className="border-gray-300 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                    <PasswordStrengthIndicator password={formData.password} />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-gray-700 font-medium"
                    >
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      placeholder="Confirm your password"
                      className="border-gray-300 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                    />
                  </div>
                  <div className="flex items-start space-x-2 mt-4">
                    <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("acceptTerms", checked as boolean)
                      }
                      className="mt-1 border-gray-300 text-[#4F46E5] focus:ring-[#4F46E5]"
                    />
                    <Label
                      htmlFor="acceptTerms"
                      className="text-sm text-gray-600 font-normal"
                    >
                      I agree to the{" "}
                      <a
                        href="/terms"
                        className="text-[#4F46E5] hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="/privacy"
                        className="text-[#4F46E5] hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Privacy Policy
                      </a>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !formData.acceptTerms}
                    className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium py-2 mt-6"
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => handleProviderSignUp("google")}
                disabled={isLoading}
                className="flex items-center justify-center w-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 transition-all"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pb-6">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#4F46E5] hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
