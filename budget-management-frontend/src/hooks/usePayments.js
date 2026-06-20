import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createPaymentOrder,
  getPremiumStatus,
  verifyPayment,
} from "../api/paymentApi";
import { getUserIdFromToken } from "../utils/jwt";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

const usePayments = () => {
  const userId = useMemo(() => getUserIdFromToken(), []);

  const [premiumStatus, setPremiumStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchPremiumStatus = useCallback(async () => {
    if (!userId) return;

    setLoadingStatus(true);
    setError("");

    try {
      const data = await getPremiumStatus(userId);
      setPremiumStatus(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to load premium status",
      );
    } finally {
      setLoadingStatus(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPremiumStatus();
  }, [fetchPremiumStatus]);

  const startPayment = async () => {
    if (!userId) {
      setError("User ID not found. Please login again.");
      return;
    }

    setPaying(true);
    setError("");
    setSuccess("");

    try {
      const loaded = await loadRazorpayScript();

      if (!loaded) {
        setError("Razorpay SDK failed to load.");
        return;
      }

      const order = await createPaymentOrder(userId);

      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "BudgetPro",
        description: order.description,
        order_id: order.order_id,
        theme: {
          color: "#2563eb",
        },
        handler: async function (response) {
          const verifyResponse = await verifyPayment({
            user_id: Number(userId),
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          setSuccess("Payment successful. You are now a Premium Member.");
          setPremiumStatus(verifyResponse);
          await fetchPremiumStatus();
        },
        modal: {
          ondismiss: function () {
            setPaying(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          "Payment failed",
      );
    } finally {
      setPaying(false);
    }
  };

  return {
    userId,
    premiumStatus,
    isPremium: Boolean(premiumStatus?.is_premium),
    loadingStatus,
    paying,
    error,
    success,
    fetchPremiumStatus,
    startPayment,
  };
};

export default usePayments;
