"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { notification } from "antd";
import Button from "../../component/ui/Button";
import { authAPI } from "../../api/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      notification.warning({
        message: "Email Required",
        description: "Please enter your email",
        placement: "topRight",
      });
      return;
    }
    setIsLoading(true);
    try {
      const result = await authAPI.sendOTP(email);
        setOtpSent(true);
        notification.success({
          message: "OTP Sent",
          description: "OTP sent to your email! Please check your inbox.",
          placement: "topRight",
        });
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.response?.data?.error || error.message || "Failed to send OTP",
        placement: "topRight",
      });
      notification.error({
        message: "Error",
        description: "Something went wrong. Please try again.",
        placement: "topRight",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      notification.warning({
        message: "Invalid OTP",
        description: "Please enter a 6-digit OTP",
        placement: "topRight",
      });
      return;
    }
    setIsLoading(true);
    try {
      const result = await authAPI.verifyOTP(email, otp);
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        notification.success({
          message: "Success",
          description: "Login successful!",
          placement: "topRight",
        });
        router.push("/dashboard");
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.response?.data?.error || error.message || "Invalid OTP",
        placement: "topRight",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      // eslint-disable-next-line no-undef
      if (typeof google !== 'undefined' && google?.accounts) {
        // eslint-disable-next-line no-undef
        google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleCallback,
        });
      }
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleGoogleCallback = async (response) => {
    try {
      setIsLoading(true);
      const data = await authAPI.googleAuth(response.credential);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        notification.success({
          message: "Success",
          description: "Login successful!",
          placement: "topRight",
        });
        router.push("/");
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.response?.data?.error || error.message || "Google login failed",
        placement: "topRight",
      });
      notification.error({
        message: "Error",
        description: "Something went wrong. Please try again.",
        placement: "topRight",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // eslint-disable-next-line no-undef
    if (typeof google !== 'undefined' && google?.accounts) {
      // eslint-disable-next-line no-undef
      google.accounts.id.prompt();
    } else {
      notification.error({
        message: "Error",
        description: "Google Sign-In not loaded. Please refresh the page.",
        placement: "topRight",
      });
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8">
          <h1 className="mb-8 text-3xl font-bold text-zinc-100">Login</h1>
          
          {!otpSent ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-300">
                  Email
                </label>
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 focus-within:border-indigo-500">
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-base text-zinc-100 placeholder-zinc-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label htmlFor="otp" className="mb-2 block text-sm font-medium text-zinc-300">
                  Enter OTP
                </label>
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 focus-within:border-indigo-500">
                  <input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full bg-transparent text-base text-zinc-100 placeholder-zinc-500 focus:outline-none"
                    maxLength={6}
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="mt-2 text-sm text-indigo-400 hover:text-indigo-300"
                >
                  Change email
                </button>
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-zinc-900 px-2 text-zinc-400">Or continue with</span>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-sm text-zinc-400">
            Don't have an account?{" "}
            <Link href="/signup" className="text-indigo-400 hover:text-indigo-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

