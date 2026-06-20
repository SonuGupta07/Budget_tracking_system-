import api from "./axios";

export const getExpenses = async () => {
  const response = await api.get("/expense/");
  return response.data;
};

export const createExpense = async (data) => {
  const response = await api.post("/expense/", data);
  return response.data;
};

export const updateExpense = async (expenseId, data) => {
  const response = await api.put(`/expense/${expenseId}`, data);
  return response.data;
};

export const deleteExpense = async (expenseId) => {
  const response = await api.delete(`/expense/${expenseId}`);
  return response.data;
};
