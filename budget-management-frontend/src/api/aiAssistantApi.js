import api from "./axios";

export const categorizeExpense = async (data) => {
  const response = await api.post("/ai/categorize-expense", data);
  return response.data;
};

export const getBudgetAdvisor = async (userId) => {
  const response = await api.post("/ai/budget-advisor", {
    user_id: Number(userId),
  });

  return response.data;
};

export const getSpendingInsights = async (userId) => {
  const response = await api.get(`/ai/spending-insights/${userId}`);
  return response.data;
};

export const getSavingsRecommendation = async (userId) => {
  const response = await api.get(`/ai/savings-recommendation/${userId}`);
  return response.data;
};

export const askFinancialChatbot = async (userId, question) => {
  const response = await api.post("/ai/financial-chatbot", {
    user_id: Number(userId),
    question,
  });

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
