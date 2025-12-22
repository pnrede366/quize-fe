"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { notification } from "antd";
import Button from "../../../component/ui/Button";

function PaymentCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Processing your payment...");

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      const orderId = searchParams.get("orderId");
      
      if (!orderId) {
        setStatus("error");
        setMessage("Invalid payment information");
        return;
      }

      // Wait a bit for PhonePe webhook to process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/payment/verify/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success && data.code === "PAYMENT_SUCCESS") {
        setStatus("success");
        setMessage("Payment successful! Your premium subscription is now active.");
        
        notification.success({
          message: "Welcome to Premium!",
          description: "You now have unlimited access to AI quiz generation.",
          placement: "topRight",
          duration: 5,
        });

        // Update local user data
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        userData.isPremium = true;
        localStorage.setItem("user", JSON.stringify(userData));
      } else if (data.code === "PAYMENT_PENDING") {
        setStatus("pending");
        setMessage("Payment is being processed. Please check back in a few minutes.");
      } else {
        setStatus("failed");
        setMessage("Payment failed or was cancelled. Please try again.");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setStatus("error");
      setMessage("Error verifying payment. Please contact support if money was deducted.");
    }
  };

  const getEmoji = () => {
    switch (status) {
      case "success":
        return "🎉";
      case "failed":
        return "😔";
      case "error":
        return "⚠️";
      case "pending":
        return "⏳";
      default:
        return "⏳";
    }
  };

  const getColor = () => {
    switch (status) {
      case "success":
        return "text-green-500";
      case "failed":
      case "error":
        return "text-red-500";
      case "pending":
        return "text-yellow-500";
      default:
        return "text-blue-500";
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6">
      <div className="max-w-md text-center">
        <div className="mb-6 text-8xl">{getEmoji()}</div>
        <h1 className={`mb-4 text-3xl font-bold ${getColor()}`}>
          {status === "processing" && "Processing Payment"}
          {status === "pending" && "Payment Pending"}
          {status === "success" && "Payment Successful!"}
          {status === "failed" && "Payment Failed"}
          {status === "error" && "Payment Error"}
        </h1>
        <p className="mb-8 text-lg text-zinc-400">{message}</p>
        
        <div className="flex justify-center gap-4">
          {status === "success" && (
            <>
              <Button variant="primary" size="lg" href="/">
                Generate Quiz
              </Button>
              <Button variant="outline" size="lg" href="/profile">
                View Profile
              </Button>
            </>
          )}
          {(status === "failed" || status === "error") && (
            <>
              <Button variant="primary" size="lg" onClick={() => router.push("/")}>
                Try Again
              </Button>
              <Button variant="outline" size="lg" href="/">
                Go Home
              </Button>
            </>
          )}
          {status === "pending" && (
            <Button variant="primary" size="lg" onClick={() => router.push("/profile")}>
              Check Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6">
        <div className="max-w-md text-center">
          <div className="mb-6 text-8xl">⏳</div>
          <h1 className="mb-4 text-3xl font-bold text-blue-500">Loading...</h1>
          <p className="text-lg text-zinc-400">Processing your payment...</p>
        </div>
      </div>
    }>
      <PaymentCallbackContent />
    </Suspense>
  );
}

