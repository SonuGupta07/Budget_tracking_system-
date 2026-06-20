import api from "./axios";

export const getSavingsGoals = async () => {
  const response = await api.get("/savings/");
  return response.data;
};

export const createSavingsGoal = async (data) => {
  const response = await api.post("/savings/", data);
  return response.data;
};

export const updateSavingsGoal = async (goalId, data) => {
  const response = await api.put(`/savings/${goalId}`, data);
  return response.data;
};

export const deleteSavingsGoal = async (goalId) => {
  const response = await api.delete(`/savings/${goalId}`);
  return response.data;
};

export const getSavingsGoalProgress = async (goalId) => {
  const response = await api.get(`/savings/progress/${goalId}`);
  return response.data;
};
