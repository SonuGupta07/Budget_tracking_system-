import api from "./axios";

export const getBudgets = async () => {
  const response = await api.get("/budget/");
  return response.data;
};

export const createBudget = async (data) => {
  const response = await api.post("/budget/", data);
  return response.data;
};

export const updateBudget = async (budgetId, data) => {
  const response = await api.put(`/budget/${budgetId}`, data);
  return response.data;
};

export const deleteBudget = async (budgetId) => {
  const response = await api.delete(`/budget/${budgetId}`);
  return response.data;
};

export const getBudgetSummary = async (userId) => {
  const response = await api.get(`/budget/summary/${userId}`);
  return response.data;
};

export const getBudgetCategorySummary = async (userId) => {
  const response = await api.get(`/budget/category-summary/${userId}`);
  return response.data;
};
