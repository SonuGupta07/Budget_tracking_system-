import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createIncome,
  deleteIncome,
  getIncome,
  updateIncome,
} from "../api/incomeApi";
import { getUserIdFromToken } from "../utils/jwt";

const useIncome = () => {
  const [incomeList, setIncomeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const userId = useMemo(() => getUserIdFromToken(), []);

  const fetchIncome = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getIncome();
      const list = Array.isArray(data) ? data : [];

      const userSpecificIncome = userId
        ? list.filter((item) => Number(item.user_id) === Number(userId))
        : list;

      setIncomeList(userSpecificIncome);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to load income records",
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addIncome = async (payload) => {
    setSaving(true);
    setError("");

    try {
      if (!userId) {
        throw new Error("User ID not found in token. Please login again.");
      }

      await createIncome({
        user_id: Number(userId),
        category_id: Number(payload.category_id),
        amount: Number(payload.amount),
        description: payload.description,
        income_date: payload.income_date,
      });

      await fetchIncome();
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Failed to create income";

      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  };

  const editIncome = async (incomeId, payload) => {
    setSaving(true);
    setError("");

    try {
      await updateIncome(incomeId, {
        category_id: Number(payload.category_id),
        amount: Number(payload.amount),
        description: payload.description,
        income_date: payload.income_date,
      });

      await fetchIncome();
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to update income";

      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  };

  const removeIncome = async (incomeId) => {
    setDeleting(true);
    setError("");

    try {
      await deleteIncome(incomeId);
      await fetchIncome();
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to delete income";

      setError(message);
      throw new Error(message);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, [fetchIncome]);

  return {
    incomeList,
    loading,
    saving,
    deleting,
    error,
    userId,
    fetchIncome,
    addIncome,
    editIncome,
    removeIncome,
  };
};

export default useIncome;
