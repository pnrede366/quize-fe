"use client";

import { useState } from "react";
import { notification } from "antd";
import Modal from "./Modal";
import Button from "./Button";

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PLANS = [
  {
    id: "monthly",
    name: "Monthly",
    price: 99,
    duration: "30 days",
    features: ["Unlimited AI quiz generation", "All difficulty levels", "Priority support", "No ads"],
    popular: false,
  },
  {
    id: "quarterly",
    name: "Quarterly",
    price: 249,
    duration: "90 days",
    features: ["Unlimited AI quiz generation", "All difficulty levels", "Priority support", "No ads", "Save ₹48"],
    popular: true,
  },
  {
    id: "yearly",
    name: "Yearly",
    price: 899,
    duration: "365 days",
    features: ["Unlimited AI quiz generation", "All difficulty levels", "Priority support", "No ads", "Save ₹289"],
    popular: false,
  },
];

export default function PremiumModal({ isOpen, onClose, quizzesRemaining = 0 }) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("quarterly");
  const [testMode, setTestMode] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (testMode) {
        // Test mode - simulate successful payment
        const response = await fetch("http://localhost:5000/api/test-payment/simulate-success", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            orderId: `TEST_ORDER_${Date.now()}`,
            plan: selectedPlan 
          }),
        });

        const data = await response.json();

        if (data.success) {
          notification.success({
            message: "Premium Activated! (TEST MODE)",
            description: "Your premium subscription is now active. This is a test transaction.",
            placement: "topRight",
            duration: 5,
          });
          
          const userData = JSON.parse(localStorage.getItem("user") || "{}");
          userData.isPremium = true;
          localStorage.setItem("user", JSON.stringify(userData));

          onClose();
          window.location.reload();
        } else {
          notification.error({
            message: "Test Mode Error",
            description: data.error || "Failed to activate premium in test mode",
            placement: "topRight",
          });
        }
      } else {
        // Real Razorpay payment
        const res = await loadRazorpayScript();
        
        if (!res) {
          notification.error({
            message: "Razorpay SDK Error",
            description: "Failed to load Razorpay SDK. Please check your internet connection.",
            placement: "topRight",
          });
          setLoading(false);
          return;
        }

        // Create order
        const response = await fetch("http://localhost:5000/api/payment/initiate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ plan: selectedPlan }),
        });

        const orderData = await response.json();

        if (!orderData.success) {
          notification.error({
            message: "Payment Error",
            description: orderData.message || orderData.error || "Failed to create order",
            placement: "topRight",
          });
          setLoading(false);
          return;
        }

        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "AI Quiz Generator",
          description: `${PLANS.find(p => p.id === selectedPlan)?.name} Subscription`,
          order_id: orderData.orderId,
          prefill: {
            name: orderData.userName,
            email: orderData.userEmail,
            contact: orderData.userMobile,
          },
          theme: {
            color: "#6366F1", // Indigo color
          },
          handler: async function (response) {
            try {
              // Verify payment
              const verifyResponse = await fetch("http://localhost:5000/api/payment/verify", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  plan: selectedPlan,
                }),
              });

              const verifyData = await verifyResponse.json();

              if (verifyData.success) {
                notification.success({
                  message: "Payment Successful!",
                  description: "Your premium subscription is now active. Enjoy unlimited quiz generation!",
                  placement: "topRight",
                  duration: 5,
                });

                const userData = JSON.parse(localStorage.getItem("user") || "{}");
                userData.isPremium = true;
                localStorage.setItem("user", JSON.stringify(userData));

                onClose();
                window.location.reload();
              } else {
                notification.error({
                  message: "Verification Failed",
                  description: "Payment received but verification failed. Please contact support.",
                  placement: "topRight",
                });
              }
            } catch (error) {
              notification.error({
                message: "Verification Error",
                description: "Error verifying payment. Please contact support.",
                placement: "topRight",
              });
            }
            setLoading(false);
          },
          modal: {
            ondismiss: function() {
              setLoading(false);
              notification.info({
                message: "Payment Cancelled",
                description: "You cancelled the payment process.",
                placement: "topRight",
              });
            }
          }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      }
    } catch (error) {
      console.error("Payment error:", error);
      notification.error({
        message: "Error",
        description: error.message || "Something went wrong. Please try again.",
        placement: "topRight",
        duration: 5,
      });
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-5xl">
      <div className="text-center">
        <div className="mb-6">
          <div className="mb-3 text-6xl">🚀</div>
          <h2 className="mb-2 text-4xl font-bold text-zinc-100">Upgrade to Premium</h2>
          {quizzesRemaining === 0 ? (
            <p className="text-lg text-zinc-400">
              You've used all your free quizzes. Upgrade now for unlimited access!
            </p>
          ) : (
            <p className="text-lg text-zinc-400">
              You have {quizzesRemaining} free quiz{quizzesRemaining === 1 ? "" : "zes"} remaining
            </p>
          )}
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative cursor-pointer rounded-2xl border-2 p-6 transition-all ${
                selectedPlan === plan.id
                  ? "border-indigo-500 bg-indigo-500/10 shadow-xl shadow-indigo-500/20"
                  : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-4 py-1 text-xs font-bold text-white">
                  MOST POPULAR
                </div>
              )}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-zinc-100">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-indigo-400">₹{plan.price}</span>
                  <span className="ml-2 text-sm text-zinc-500">/ {plan.duration}</span>
                </div>
              </div>
              <ul className="mb-4 space-y-2 text-left text-sm text-zinc-300">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Test Mode Toggle */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <input
            type="checkbox"
            id="testMode"
            checked={testMode}
            onChange={(e) => setTestMode(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
          />
          <label htmlFor="testMode" className="text-sm text-zinc-400 cursor-pointer">
            Enable Test Mode (Skip payment, activate premium instantly)
          </label>
        </div>

        <div className="flex justify-center gap-4">
          <Button variant="outline" size="lg" onClick={onClose} disabled={loading}>
            Maybe Later
          </Button>
          <Button variant="primary" size="lg" onClick={handleUpgrade} disabled={loading}>
            {loading ? "Processing..." : testMode ? "Activate Premium (Test)" : "Pay with Razorpay"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
