import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createBudget,
  deleteBudget,
  getBudgetCategorySummary,
  getBudgets,
  getBudgetSummary,
  updateBudget,
} from "../api/budgetApi";
import { getUserIdFromToken } from "../utils/jwt";

const useBudget = () => {
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [categorySummary, setCategorySummary] = useState([]);

  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");

  const userId = useMemo(() => getUserIdFromToken(), []);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getBudgets();
      const list = Array.isArray(data) ? data : [];

      const userSpecificBudgets = userId
        ? list.filter((item) => Number(item.user_id) === Number(userId))
        : list;

      setBudgets(userSpecificBudgets);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to load budget records",
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchBudgetInsights = useCallback(async () => {
    if (!userId) return;

    setSummaryLoading(true);

    try {
      const [summaryData, categorySummaryData] = await Promise.all([
        getBudgetSummary(userId),
        getBudgetCategorySummary(userId),
      ]);

      setSummary(summaryData);
      setCategorySummary(
        Array.isArray(categorySummaryData) ? categorySummaryData : [],
      );
    } catch {
      setSummary(null);
      setCategorySummary([]);
    } finally {
      setSummaryLoading(false);
    }
  }, [userId]);

  const refreshBudgetData = useCallback(async () => {
    await fetchBudgets();
    await fetchBudgetInsights();
  }, [fetchBudgets, fetchBudgetInsights]);

  const addBudget = async (payload) => {
    setSaving(true);
    setError("");

    try {
      if (!userId) {
        throw new Error("User ID not found in token. Please login again.");
      }

      await createBudget({
        user_id: Number(userId),
        category_id: Number(payload.category_id),
        month: Number(payload.month),
        year: Number(payload.year),
        budget_amount: Number(payload.budget_amount),
      });

      await refreshBudgetData();
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Failed to create budget";

      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  };

  const editBudget = async (budgetId, payload) => {
    setSaving(true);
    setError("");

    try {
      await updateBudget(budgetId, {
        category_id: Number(payload.category_id),
        month: Number(payload.month),
        year: Number(payload.year),
        budget_amount: Number(payload.budget_amount),
      });

      await refreshBudgetData();
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to update budget";

      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  };

  const removeBudget = async (budgetId) => {
    setDeleting(true);
    setError("");

    try {
      await deleteBudget(budgetId);
      await refreshBudgetData();
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to delete budget";

      setError(message);
      throw new Error(message);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    refreshBudgetData();
  }, [refreshBudgetData]);

  return {
    budgets,
    summary,
    categorySummary,
    loading,
    summaryLoading,
    saving,
    deleting,
    error,
    userId,
    refreshBudgetData,
    addBudget,
    editBudget,
    removeBudget,
  };
};

export default useBudget;
