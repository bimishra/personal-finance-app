import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { initAuth, handleRedirectCallback } from "../services/auth";
import { useUser } from "../context/UserContext";

export default function LoginCallback() {
  const navigate = useNavigate();
  const { fetchUser } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      // Prevent multiple processing
      if (isProcessing) return;
      setIsProcessing(true);

      try {
        // Initialize Auth0 client
        await initAuth();

        // Only handle callback if we have the expected URL parameters
        if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
          // Check if we're already authenticated before processing callback
          const { isAuthenticated } = await import("../services/auth");
          const alreadyAuth = await isAuthenticated();
          
          if (alreadyAuth) {
            console.log("User already authenticated, skipping callback processing");
            await fetchUser();
            navigate("/dashboard", { replace: true });
          } else {
            await handleRedirectCallback();
            // Fetch user data using UserContext
            await fetchUser();
            navigate("/dashboard", { replace: true });
          }
        } else {
          // If no valid callback parameters, redirect to login
          console.warn("No valid callback parameters found");
          navigate("/login", { replace: true });
        }
      } catch (e) {
        console.error("Callback error:", e);
        
        // Only show error UI for unexpected errors, not for "Invalid state" which might be expected
        const errorMessage = e instanceof Error ? e.message : String(e);
        if (!errorMessage.includes("Invalid state")) {
          setError("Authentication failed. Please try logging in again.");
          
          // Wait a moment to show the error, then redirect
          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 3000);
        } else {
          // For "Invalid state" errors, just redirect to login without showing error UI
          console.log("Invalid state error detected, redirecting to login");
          navigate("/login", { replace: true });
        }
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [navigate, fetchUser, isProcessing]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center bg-white p-8 rounded-lg shadow-md">
        {error ? (
          <>
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-red-600 mb-2">Authentication Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to login page...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Completing sign in...</h2>
            <p className="text-gray-600">Please wait while we set up your account.</p>
          </>
        )}
      </div>
    </div>
  );
}
