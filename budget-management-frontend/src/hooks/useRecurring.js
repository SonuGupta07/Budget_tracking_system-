import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createRecurringTransaction,
  deleteRecurringTransaction,
  getRecurringTransactions,
  updateRecurringTransaction,
} from "../api/recurringApi";
import { getUserIdFromToken } from "../utils/jwt";

const useRecurring = () => {
  const [recurringList, setRecurringList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const userId = useMemo(() => getUserIdFromToken(), []);

  const fetchRecurring = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getRecurringTransactions();
      const list = Array.isArray(data) ? data : [];

      const userSpecificRecurring = userId
        ? list.filter((item) => Number(item.user_id) === Number(userId))
        : list;

      setRecurringList(userSpecificRecurring);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to load recurring transactions",
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addRecurring = async (payload) => {
    setSaving(true);
    setError("");

    try {
      if (!userId) {
        throw new Error("User ID not found in token. Please login again.");
      }

      await createRecurringTransaction({
        user_id: Number(userId),
        transaction_type: payload.transaction_type,
        category_id: Number(payload.category_id),
        amount: Number(payload.amount),
        frequency: payload.frequency,
        next_run_date: payload.next_run_date,
      });

      await fetchRecurring();
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Failed to create recurring transaction";

      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  };

  const editRecurring = async (recurringId, payload) => {
    setSaving(true);
    setError("");

    try {
      await updateRecurringTransaction(recurringId, {
        transaction_type: payload.transaction_type,
        category_id: Number(payload.category_id),
        amount: Number(payload.amount),
        frequency: payload.frequency,
        next_run_date: payload.next_run_date,
      });

      await fetchRecurring();
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to update recurring transaction";

      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  };

  const removeRecurring = async (recurringId) => {
    setDeleting(true);
    setError("");

    try {
      await deleteRecurringTransaction(recurringId);
      await fetchRecurring();
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to delete recurring transaction";

      setError(message);
      throw new Error(message);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchRecurring();
  }, [fetchRecurring]);

  return {
    recurringList,
    loading,
    saving,
    deleting,
    error,
    userId,
    fetchRecurring,
    addRecurring,
    editRecurring,
    removeRecurring,
  };
};

export default useRecurring;
