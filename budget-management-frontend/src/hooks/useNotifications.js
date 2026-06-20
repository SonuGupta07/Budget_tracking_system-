import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createNotification,
  deleteNotification,
  getAllBudgets,
  getAllCategories,
  getAllExpenses,
  getAllRecurringTransactions,
  getAllSavingsGoals,
  getNotificationsByUser,
  markNotificationAsRead,
} from "../api/notificationApi";
import { getUserIdFromToken } from "../utils/jwt";

const normalizeArray = (data) => {
  if (Array.isArray(data)) return data;
  if (!data) return [];
  return [data];
};

const getDaysRemaining = (dateValue) => {
  if (!dateValue) return null;

  const today = new Date();
  const target = new Date(dateValue);

  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  return Math.ceil(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
};

const buildCategoryMap = (categories) => {
  const map = {};

  categories.forEach((category) => {
    map[Number(category.category_id)] = category.category_name;
  });

  return map;
};

const buildSmartAlerts = ({
  budgets,
  expenses,
  savingsGoals,
  recurringTransactions,
  categories,
  userId,
}) => {
  const alerts = [];
  const categoryMap = buildCategoryMap(categories);

  const userBudgets = budgets.filter(
    (item) => Number(item.user_id) === Number(userId),
  );

  const userExpenses = expenses.filter(
    (item) => Number(item.user_id) === Number(userId),
  );

  const userSavingsGoals = savingsGoals.filter(
    (item) => Number(item.user_id) === Number(userId),
  );

  const userRecurring = recurringTransactions.filter(
    (item) => Number(item.user_id) === Number(userId),
  );

  userBudgets.forEach((budget) => {
    const expenseForBudget = userExpenses
      .filter((expense) => {
        const expenseDate = new Date(expense.expense_date);

        return (
          Number(expense.category_id) === Number(budget.category_id) &&
          expenseDate.getMonth() + 1 === Number(budget.month) &&
          expenseDate.getFullYear() === Number(budget.year)
        );
      })
      .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

    const budgetAmount = Number(budget.budget_amount || 0);
    const usage =
      budgetAmount > 0 ? (expenseForBudget / budgetAmount) * 100 : 0;
    const categoryName = categoryMap[Number(budget.category_id)] || "Budget";

    if (usage >= 100) {
      alerts.push({
        type: "BUDGET_EXCEEDED",
        severity: "error",
        title: "Budget Exceeded",
        message: `${categoryName} budget exceeded. Usage is ${usage.toFixed(
          1,
        )}% for ${budget.month}/${budget.year}.`,
      });
    } else if (usage >= 80) {
      alerts.push({
        type: "BUDGET_WARNING",
        severity: "warning",
        title: "Budget Warning",
        message: `${categoryName} budget reached ${usage.toFixed(
          1,
        )}%. Monitor spending carefully.`,
      });
    }
  });

  userSavingsGoals.forEach((goal) => {
    const target = Number(goal.target_amount || 0);
    const current = Number(goal.current_amount || 0);
    const progress = target > 0 ? (current / target) * 100 : 0;
    const daysRemaining = getDaysRemaining(goal.target_date);

    if (progress >= 100) {
      alerts.push({
        type: "SAVINGS_COMPLETED",
        severity: "success",
        title: "Savings Goal Completed",
        message: `${goal.goal_name} has reached the target amount.`,
      });
    } else if (daysRemaining !== null && daysRemaining < 0) {
      alerts.push({
        type: "SAVINGS_OVERDUE",
        severity: "error",
        title: "Savings Goal Overdue",
        message: `${goal.goal_name} target date is overdue by ${Math.abs(
          daysRemaining,
        )} day(s).`,
      });
    } else if (daysRemaining !== null && daysRemaining <= 7) {
      alerts.push({
        type: "SAVINGS_DUE_SOON",
        severity: "warning",
        title: "Savings Goal Due Soon",
        message: `${goal.goal_name} target date is due in ${daysRemaining} day(s).`,
      });
    }
  });

  userRecurring.forEach((item) => {
    const daysRemaining = getDaysRemaining(item.next_run_date);
    const categoryName = categoryMap[Number(item.category_id)] || "Recurring";

    if (daysRemaining !== null && daysRemaining < 0) {
      alerts.push({
        type: "RECURRING_OVERDUE",
        severity: "error",
        title: "Recurring Transaction Overdue",
        message: `${categoryName} recurring transaction is overdue by ${Math.abs(
          daysRemaining,
        )} day(s).`,
      });
    } else if (daysRemaining !== null && daysRemaining <= 7) {
      alerts.push({
        type: "RECURRING_DUE_SOON",
        severity: "info",
        title: "Recurring Transaction Due Soon",
        message: `${categoryName} recurring transaction is due in ${daysRemaining} day(s).`,
      });
    }
  });

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const currentMonthExpenses = userExpenses.filter((expense) => {
    const date = new Date(expense.expense_date);

    return (
      date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear
    );
  });

  const totalCurrentMonthExpense = currentMonthExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0,
  );

  if (totalCurrentMonthExpense > 50000) {
    alerts.push({
      type: "HIGH_EXPENSE",
      severity: "warning",
      title: "High Monthly Expense",
      message: `Current month expense is ₹${totalCurrentMonthExpense.toLocaleString(
        "en-IN",
      )}. Review spending patterns.`,
    });
  }

  return alerts;
};

const useNotifications = () => {
  const userId = useMemo(() => getUserIdFromToken(), []);

  const [notifications, setNotifications] = useState([]);
  const [smartAlerts, setSmartAlerts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");

  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setError("User ID not found in token. Please login again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const results = await Promise.allSettled([
        getNotificationsByUser(userId),
        getAllBudgets(),
        getAllExpenses(),
        getAllSavingsGoals(),
        getAllRecurringTransactions(),
        getAllCategories(),
      ]);

      const userNotifications =
        results[0].status === "fulfilled"
          ? normalizeArray(results[0].value)
          : [];

      const budgets =
        results[1].status === "fulfilled"
          ? normalizeArray(results[1].value)
          : [];

      const expenses =
        results[2].status === "fulfilled"
          ? normalizeArray(results[2].value)
          : [];

      const savingsGoals =
        results[3].status === "fulfilled"
          ? normalizeArray(results[3].value)
          : [];

      const recurringTransactions =
        results[4].status === "fulfilled"
          ? normalizeArray(results[4].value)
          : [];

      const categories =
        results[5].status === "fulfilled"
          ? normalizeArray(results[5].value)
          : [];

      setNotifications(
        userNotifications.sort(
          (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0),
        ),
      );

      setSmartAlerts(
        buildSmartAlerts({
          budgets,
          expenses,
          savingsGoals,
          recurringTransactions,
          categories,
          userId,
        }),
      );
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to load notifications",
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const addNotification = async (payload) => {
    if (!userId) {
      throw new Error("User ID not found in token. Please login again.");
    }

    setSaving(true);
    setError("");

    try {
      await createNotification({
        user_id: Number(userId),
        title: payload.title,
        message: payload.message,
      });

      await fetchNotifications();
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to create notification";

      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  };

  const saveSmartAlertAsNotification = async (alert) => {
    await addNotification({
      title: alert.title,
      message: alert.message,
    });
  };

  const markAsRead = async (notificationId) => {
    setUpdating(true);
    setError("");

    try {
      await markNotificationAsRead(notificationId);
      await fetchNotifications();
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to mark notification as read";

      setError(message);
      throw new Error(message);
    } finally {
      setUpdating(false);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter((item) => item.is_read !== "Y");

    setUpdating(true);
    setError("");

    try {
      await Promise.all(
        unread.map((item) => markNotificationAsRead(item.notification_id)),
      );

      await fetchNotifications();
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to mark all notifications as read";

      setError(message);
      throw new Error(message);
    } finally {
      setUpdating(false);
    }
  };

  const removeNotification = async (notificationId) => {
    setDeleting(true);
    setError("");

    try {
      await deleteNotification(notificationId);
      await fetchNotifications();
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to delete notification";

      setError(message);
      throw new Error(message);
    } finally {
      setDeleting(false);
    }
  };

  const unreadCount = useMemo(() => {
    return notifications.filter((item) => item.is_read !== "Y").length;
  }, [notifications]);

  const totalAlertCount = unreadCount + smartAlerts.length;

  return {
    userId,
    notifications,
    smartAlerts,
    unreadCount,
    totalAlertCount,
    loading,
    saving,
    updating,
    deleting,
    error,
    fetchNotifications,
    addNotification,
    saveSmartAlertAsNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
  };
};

export default useNotifications;
