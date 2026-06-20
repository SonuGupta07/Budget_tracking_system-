import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createSavingsGoal,
  deleteSavingsGoal,
  getSavingsGoalProgress,
  getSavingsGoals,
  updateSavingsGoal,
} from "../api/savingsApi";
import { getUserIdFromToken } from "../utils/jwt";

const useSavings = () => {
  const [goals, setGoals] = useState([]);
  const [selectedProgress, setSelectedProgress] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [progressLoading, setProgressLoading] = useState(false);

  const [error, setError] = useState("");

  const userId = useMemo(() => getUserIdFromToken(), []);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getSavingsGoals();
      const list = Array.isArray(data) ? data : [];

      const userSpecificGoals = userId
        ? list.filter((goal) => Number(goal.user_id) === Number(userId))
        : list;

      setGoals(userSpecificGoals);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to load savings goals",
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addGoal = async (payload) => {
    setSaving(true);
    setError("");

    try {
      if (!userId) {
        throw new Error("User ID not found in token. Please login again.");
      }

      await createSavingsGoal({
        user_id: Number(userId),
        goal_name: payload.goal_name,
        target_amount: Number(payload.target_amount),
        current_amount: Number(payload.current_amount),
        target_date: payload.target_date,
      });

      await fetchGoals();
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Failed to create savings goal";

      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  };

  const editGoal = async (goalId, payload) => {
    setSaving(true);
    setError("");

    try {
      await updateSavingsGoal(goalId, {
        goal_name: payload.goal_name,
        target_amount: Number(payload.target_amount),
        current_amount: Number(payload.current_amount),
        target_date: payload.target_date,
      });

      await fetchGoals();
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to update savings goal";

      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  };

  const removeGoal = async (goalId) => {
    setDeleting(true);
    setError("");

    try {
      await deleteSavingsGoal(goalId);
      await fetchGoals();
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to delete savings goal";

      setError(message);
      throw new Error(message);
    } finally {
      setDeleting(false);
    }
  };

  const fetchGoalProgress = async (goalId) => {
    setProgressLoading(true);
    setSelectedProgress(null);

    try {
      const data = await getSavingsGoalProgress(goalId);
      setSelectedProgress(data);
      return data;
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to load goal progress";

      setError(message);
      throw new Error(message);
    } finally {
      setProgressLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return {
    goals,
    selectedProgress,
    loading,
    saving,
    deleting,
    progressLoading,
    error,
    userId,
    fetchGoals,
    addGoal,
    editGoal,
    removeGoal,
    fetchGoalProgress,
  };
};

export default useSavings;
