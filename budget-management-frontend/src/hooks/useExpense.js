import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from "../api/expenseApi";
import { getUserIdFromToken } from "../utils/jwt";

const useExpense = () => {
  const [expenseList, setExpenseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const userId = useMemo(() => getUserIdFromToken(), []);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getExpenses();
      const list = Array.isArray(data) ? data : [];

      const userSpecificExpenses = userId
        ? list.filter((item) => Number(item.user_id) === Number(userId))
        : list;

      setExpenseList(userSpecificExpenses);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to load expense records",
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addExpense = async (payload) => {
    setSaving(true);
    setError("");

    try {
      if (!userId) {
        throw new Error("User ID not found in token. Please login again.");
      }

      await createExpense({
        user_id: Number(userId),
        category_id: Number(payload.category_id),
        amount: Number(payload.amount),
        description: payload.description,
        expense_date: payload.expense_date,
      });

      await fetchExpenses();
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Failed to create expense";

      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  };

  const editExpense = async (expenseId, payload) => {
    setSaving(true);
    setError("");

    try {
      await updateExpense(expenseId, {
        category_id: Number(payload.category_id),
        amount: Number(payload.amount),
        description: payload.description,
        expense_date: payload.expense_date,
      });

      await fetchExpenses();
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to update expense";

      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  };

  const removeExpense = async (expenseId) => {
    setDeleting(true);
    setError("");

    try {
      await deleteExpense(expenseId);
      await fetchExpenses();
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to delete expense";

      setError(message);
      throw new Error(message);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return {
    expenseList,
    loading,
    saving,
    deleting,
    error,
    userId,
    fetchExpenses,
    addExpense,
    editExpense,
    removeExpense,
  };
};

export default useExpense;
