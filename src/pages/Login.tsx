import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import { signInWithProvider, signInWithEmail } from "@/lib/supabase";
import { Provider } from "@supabase/supabase-js";
import { Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await signInWithEmail(
        formData.email,
        formData.password
      );
      if (error) throw error;
      navigate("/dashboard");
    } catch (error) {
      toast.error("Invalid email or password");
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProviderSignIn = async (provider: Provider) => {
    setIsLoading(true);
    try {
      const { error } = await signInWithProvider(provider);
      if (error) {
        toast.error(`Error signing in with ${provider}. Please try again.`);
        console.error(`${provider} sign in error:`, error);
      }
    } catch (error) {
      toast.error(`Error signing in with ${provider}. Please try again.`);
      console.error(`${provider} sign in error:`, error);
    } finally {
      setIsLoading(false);
    }
  };

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
                className="ml-2 bg-purple-100 text-purple-800 border-purple-300 font-semibold"
              >
                BETA
              </Badge>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              Sign in to your GTMCentric account
            </CardTitle>
            <CardDescription className="text-center text-gray-500 mt-1">
              Choose how you want to sign in
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <form onSubmit={handleEmailSignIn} className="space-y-5 mb-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
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
                  disabled={isLoading}
                  className="border-gray-300 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
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
                    placeholder="Enter your password"
                    disabled={isLoading}
                    className="border-gray-300 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium py-2"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in with Email"}
              </Button>
            </form>

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
                onClick={() => handleProviderSignIn("google")}
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
                {isLoading ? "Signing in..." : "Continue with Google"}
              </Button>

              <Button
                variant="outline"
                onClick={() => handleProviderSignIn("azure")}
                disabled={isLoading}
                className="flex items-center justify-center w-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 transition-all"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M11.4 24H0l11.4-11.4L0 0h11.4l11.4 11.4L11.4 24z"
                    fill="#F25022"
                  />
                  <path d="M24 24H12.6L24 12.6V24z" fill="#00A4EF" />
                  <path d="M24 11.4H12.6L24 0v11.4z" fill="#7FBA00" />
                  <path d="M11.4 11.4H0L11.4 0v11.4z" fill="#FFB900" />
                </svg>
                {isLoading ? "Signing in..." : "Continue with Microsoft"}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pb-6">
            <p className="text-sm text-gray-600">
              New to GTMCentric?{" "}
              <Link
                to="/signup"
                className="text-[#4F46E5] hover:underline font-medium"
              >
                Create account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
