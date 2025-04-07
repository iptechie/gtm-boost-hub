import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session) {
          navigate("/signup");
          return;
        }

        // Check if user profile exists
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        // If profile doesn't exist or there's a PGRST116 error (not found)
        if (profileError?.code === "PGRST116" || !profile) {
          // This is a new user, redirect to subscription selection
          navigate("/subscription/select");
          return;
        }

        // If profile exists but no subscription tier is selected
        if (!profile.subscription_tier) {
          navigate("/subscription/select");
          return;
        }

        // If everything is set up, redirect to dashboard
        navigate("/dashboard");
      } catch (error) {
        console.error("Auth callback error:", error);
        toast.error("Authentication failed. Please try again.");
        navigate("/signup");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Verifying your account...
        </h2>
        <p className="text-gray-600">
          Please wait while we complete the process.
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
