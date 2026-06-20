import api from "./axios";

export const getIncome = async () => {
  const response = await api.get("/income/");
  return response.data;
};

export const createIncome = async (data) => {
  const response = await api.post("/income/", data);
  return response.data;
};

export const updateIncome = async (incomeId, data) => {
  const response = await api.put(`/income/${incomeId}`, data);
  return response.data;
};

export const deleteIncome = async (incomeId) => {
  const response = await api.delete(`/income/${incomeId}`);
  return response.data;
};
