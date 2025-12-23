"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { message as antdMessage } from "antd";
import Button from "../../../component/ui/Button";
import Loader from "../../../component/ui/Loader";
import { paymentAPI } from "../../../api/api";

function PaymentCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("processing");
  const [statusMessage, setStatusMessage] = useState("Processing your payment...");

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      const orderId = searchParams.get("orderId");
      
      if (!orderId) {
        setStatus("error");
        setStatusMessage("Invalid payment information");
        return;
      }

      // Wait a bit for PhonePe webhook to process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const data = await paymentAPI.verifyById(orderId);

      if (data.success && data.code === "PAYMENT_SUCCESS") {
        setStatus("success");
        setStatusMessage("Payment successful! Your premium subscription is now active.");
        
        antdMessage.success("Welcome to Premium! You now have unlimited access to AI quiz generation.", 5);

        // Update local user data
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        userData.isPremium = true;
        localStorage.setItem("user", JSON.stringify(userData));
      } else if (data.code === "PAYMENT_PENDING") {
        setStatus("pending");
        setStatusMessage("Payment is being processed. Please check back in a few minutes.");
      } else {
        setStatus("failed");
        setStatusMessage("Payment failed or was cancelled. Please try again.");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setStatus("error");
      setStatusMessage("Error verifying payment. Please contact support if money was deducted.");
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
        <p className="mb-8 text-lg text-zinc-400">{statusMessage}</p>
        
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
    <Suspense fallback={<Loader emoji="⏳" message="Processing your payment..." size="xl" />}>
      <PaymentCallbackContent />
    </Suspense>
  );
}

