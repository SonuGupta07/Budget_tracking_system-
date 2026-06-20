import api from "./axios";

export const createPaymentOrder = async (userId) => {
  const response = await api.post("/payments/create-order", {
    user_id: Number(userId),
    plan_code: "PREMIUM_MONTHLY",
  });

  return response.data;
};

export const verifyPayment = async (data) => {
  const response = await api.post("/payments/verify-payment", data);
  return response.data;
};

export const getPremiumStatus = async (userId) => {
  const response = await api.get(`/payments/status/${userId}`);
  return response.data;
};
