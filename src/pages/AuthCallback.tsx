import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleOAuthCallback } from "@/lib/supabase";

/**
 * AuthCallback component
 * This page handles the OAuth redirect and initializes workspaces for OAuth users
 */
const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        const { data, error } = await handleOAuthCallback();

        if (error) {
          console.error("Error handling OAuth callback:", error);
          setError("Authentication failed. Please try again.");
          setTimeout(() => navigate("/login"), 3000);
          return;
        }

        // Success - redirect to dashboard
        navigate("/dashboard");
      } catch (err) {
        console.error("Unexpected error in OAuth callback:", err);
        setError("An unexpected error occurred. Please try again.");
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    processOAuthCallback();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center">
        {error ? (
          <div className="text-red-600 font-medium mb-4">{error}</div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4 text-indigo-700">
              Finalizing Authentication
            </h1>
            <p className="text-gray-600 mb-4">
              Please wait while we complete the sign-in process...
            </p>
            <div className="flex justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
