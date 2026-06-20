import { useCallback, useEffect, useState } from "react";
import { createCategory, getCategories } from "../api/categoryApi";

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to load categories",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const addCategory = async (payload) => {
    setCreating(true);
    setError("");

    try {
      await createCategory(payload);
      await fetchCategories();
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to create category";

      setError(message);
      throw new Error(message);
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
     fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    creating,
    error,
    fetchCategories,
    addCategory,
  };
};

export default useCategories;
