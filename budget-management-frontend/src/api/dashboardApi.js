import api from "./axios";

export const getDashboardOverview = async (userId) => {
  const response = await api.get(`/dashboard/${userId}`);
  return response.data;
};

export const getFinancialHealth = async (userId) => {
  const response = await api.get(`/financial-health/${userId}`);
  return response.data;
};

export const getTrendAnalysis = async (userId) => {
  const response = await api.get(`/analytics/trend/${userId}`);
  return response.data;
};

export const getAllCategories = async () => {
  const response = await api.get("/categories/");
  return response.data;
};

export const getAllIncome = async () => {
  const response = await api.get("/income/");
  return response.data;
};

export const getAllExpenses = async () => {
  const response = await api.get("/expense/");
  return response.data;
};

export const getAllBudgets = async () => {
  const response = await api.get("/budget/");
  return response.data;
};

export const getAllSavingsGoals = async () => {
  const response = await api.get("/savings/");
  return response.data;
};

export const getAllRecurringTransactions = async () => {
  const response = await api.get("/recurring/");
  return response.data;
};
