import api from "./axios";

export const getAnalyticsExpensePie = async (userId) => {
  const response = await api.get(`/analytics/pie-chart/${userId}`);
  return response.data;
};

export const getAnalyticsMonthlyBar = async (userId, month, year) => {
  const response = await api.get(`/analytics/bar-chart/${userId}`, {
    params: {
      month,
      year,
    },
  });

  return response.data;
};

export const getAnalyticsYearlyBar = async (userId, year) => {
  const response = await api.get(`/analytics/bar-chart-year/${userId}`, {
    params: {
      year,
    },
  });

  return response.data;
};

export const getAnalyticsDateRange = async (userId, startDate, endDate) => {
  const response = await api.get(`/analytics/date-range/${userId}`, {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });

  return response.data;
};

export const getAnalyticsTrend = async (userId) => {
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
