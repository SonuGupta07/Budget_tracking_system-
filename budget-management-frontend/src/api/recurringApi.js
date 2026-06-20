import api from "./axios";

export const getRecurringTransactions = async () => {
  const response = await api.get("/recurring/");
  return response.data;
};

export const createRecurringTransaction = async (data) => {
  const response = await api.post("/recurring/", data);
  return response.data;
};

export const updateRecurringTransaction = async (recurringId, data) => {
  const response = await api.put(`/recurring/${recurringId}`, data);
  return response.data;
};

export const deleteRecurringTransaction = async (recurringId) => {
  const response = await api.delete(`/recurring/${recurringId}`);
  return response.data;
};
