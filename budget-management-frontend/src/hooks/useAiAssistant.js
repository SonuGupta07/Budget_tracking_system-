import { useCallback, useEffect, useMemo, useState } from "react";
import {
  askFinancialChatbot,
  categorizeExpense,
  getAllBudgets,
  getAllCategories,
  getAllExpenses,
  getAllIncome,
  getAllRecurringTransactions,
  getAllSavingsGoals,
  getBudgetAdvisor,
  getSavingsRecommendation,
  getSpendingInsights,
} from "../api/aiAssistantApi";
import { getUserIdFromToken } from "../utils/jwt";

const normalizeArray = (data) => {
  if (Array.isArray(data)) return data;
  if (!data) return [];
  return [data];
};

const buildCategoryMap = (categories) => {
  const map = {};

  categories.forEach((category) => {
    map[Number(category.category_id)] = category.category_name;
  });

  return map;
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

const detectAnomalies = ({ expenses, categoryMap }) => {
  const anomalies = [];

  const expenseAmounts = expenses.map((expense) => Number(expense.amount || 0));

  const averageExpense =
    expenseAmounts.length > 0
      ? expenseAmounts.reduce((sum, amount) => sum + amount, 0) /
        expenseAmounts.length
      : 0;

  expenses.forEach((expense) => {
    const amount = Number(expense.amount || 0);

    if (averageExpense > 0 && amount >= averageExpense * 2) {
      anomalies.push({
        title: "Unusual High Expense",
        message: `${expense.description || "Expense"} is much higher than your average expense.`,
        amount,
        category:
          categoryMap[Number(expense.category_id)] || "Unknown Category",
        date: expense.expense_date,
      });
    }
  });

  return anomalies.slice(0, 5);
};

const useAiAssistant = () => {
  const userId = useMemo(() => getUserIdFromToken(), []);

  const [categories, setCategories] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [budgetList, setBudgetList] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [recurringList, setRecurringList] = useState([]);

  const [spendingInsights, setSpendingInsights] = useState(null);
  const [savingsRecommendation, setSavingsRecommendation] = useState(null);
  const [budgetAdvisor, setBudgetAdvisor] = useState(null);
  const [expensePrediction, setExpensePrediction] = useState(null);

  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I can help you understand your spending, budgets, savings goals and financial health. Ask me anything about your finances.",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [categorizing, setCategorizing] = useState(false);
  const [error, setError] = useState("");

  const fetchAiData = useCallback(async () => {
    if (!userId) {
      setError("User ID not found in token. Please login again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const results = await Promise.allSettled([
        getAllCategories(),
        getAllIncome(),
        getAllExpenses(),
        getAllBudgets(),
        getAllSavingsGoals(),
        getAllRecurringTransactions(),
        getSpendingInsights(userId),
        getSavingsRecommendation(userId),
      ]);

      const allCategories =
        results[0].status === "fulfilled"
          ? normalizeArray(results[0].value)
          : [];

      const allIncome =
        results[1].status === "fulfilled"
          ? normalizeArray(results[1].value)
          : [];

      const allExpenses =
        results[2].status === "fulfilled"
          ? normalizeArray(results[2].value)
          : [];

      const allBudgets =
        results[3].status === "fulfilled"
          ? normalizeArray(results[3].value)
          : [];

      const allSavings =
        results[4].status === "fulfilled"
          ? normalizeArray(results[4].value)
          : [];

      const allRecurring =
        results[5].status === "fulfilled"
          ? normalizeArray(results[5].value)
          : [];

      setCategories(allCategories);

      setIncomeList(
        allIncome.filter((item) => Number(item.user_id) === Number(userId)),
      );

      setExpenseList(
        allExpenses.filter((item) => Number(item.user_id) === Number(userId)),
      );

      setBudgetList(
        allBudgets.filter((item) => Number(item.user_id) === Number(userId)),
      );

      setSavingsGoals(
        allSavings.filter((item) => Number(item.user_id) === Number(userId)),
      );

      setRecurringList(
        allRecurring.filter((item) => Number(item.user_id) === Number(userId)),
      );

      if (results[6].status === "fulfilled") {
        setSpendingInsights(results[6].value);
      }

      if (results[7].status === "fulfilled") {
        setSavingsRecommendation(results[7].value);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to load AI assistant data",
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAiData();
  }, [fetchAiData]);

  const categoryMap = useMemo(() => {
    return buildCategoryMap(categories);
  }, [categories]);

  const financialSummary = useMemo(() => {
    const totalIncome = incomeList.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0,
    );

    const totalExpense = expenseList.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0,
    );

    const totalBudget = budgetList.reduce(
      (sum, item) => sum + Number(item.budget_amount || 0),
      0,
    );

    const savingsTarget = savingsGoals.reduce(
      (sum, item) => sum + Number(item.target_amount || 0),
      0,
    );

    const currentSavings = savingsGoals.reduce(
      (sum, item) => sum + Number(item.current_amount || 0),
      0,
    );

    const expenseRatio =
      totalIncome > 0
        ? Number(((totalExpense / totalIncome) * 100).toFixed(2))
        : 0;

    const savingsProgress =
      savingsTarget > 0
        ? Number(((currentSavings / savingsTarget) * 100).toFixed(2))
        : 0;

    const budgetUsage =
      totalBudget > 0
        ? Number(((totalExpense / totalBudget) * 100).toFixed(2))
        : 0;

    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      totalBudget,
      savingsTarget,
      currentSavings,
      expenseRatio,
      savingsProgress,
      budgetUsage,
    };
  }, [incomeList, expenseList, budgetList, savingsGoals]);

  const recentExpenses = useMemo(() => {
    return [...expenseList]
      .sort((a, b) => new Date(b.expense_date) - new Date(a.expense_date))
      .slice(0, 8)
      .map((expense) => ({
        ...expense,
        category_name:
          categoryMap[Number(expense.category_id)] || "Unknown Category",
      }));
  }, [expenseList, categoryMap]);

  const anomalies = useMemo(() => {
    return detectAnomalies({
      expenses: expenseList,
      categoryMap,
    });
  }, [expenseList, categoryMap]);

  const upcomingRecurring = useMemo(() => {
    return recurringList
      .map((item) => ({
        ...item,
        category_name: categoryMap[Number(item.category_id)] || "Unknown",
        days_remaining: getDaysRemaining(item.next_run_date),
      }))
      .filter(
        (item) => item.days_remaining !== null && item.days_remaining >= 0,
      )
      .sort((a, b) => a.days_remaining - b.days_remaining)
      .slice(0, 5);
  }, [recurringList, categoryMap]);

  const generateBudgetAdvisor = async () => {
    if (!userId) return;

    setAiLoading(true);
    setError("");

    try {
      const data = await getBudgetAdvisor(userId);
      setBudgetAdvisor(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to generate budget advisor",
      );
    } finally {
      setAiLoading(false);
    }
  };

  const askQuestion = async (question) => {
    if (!question.trim()) return;

    setChatMessages((previous) => [
      ...previous,
      {
        role: "user",
        text: question,
      },
    ]);

    setChatLoading(true);
    setError("");

    try {
      const data = await askFinancialChatbot(userId, question);

      setChatMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text:
            data.answer || data.response || "I could not generate an answer.",
        },
      ]);
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "AI assistant could not answer right now.";

      setChatMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: message,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const runExpenseCategorization = async (expense) => {
    setCategorizing(true);
    setError("");

    try {
      const data = await categorizeExpense({
        expense_id: Number(expense.expense_id),
        description: expense.description || "",
      });

      setExpensePrediction(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to categorize expense",
      );
    } finally {
      setCategorizing(false);
    }
  };

  return {
    userId,
    loading,
    aiLoading,
    chatLoading,
    categorizing,
    error,
    fetchAiData,
    financialSummary,
    spendingInsights,
    savingsRecommendation,
    budgetAdvisor,
    expensePrediction,
    recentExpenses,
    anomalies,
    upcomingRecurring,
    chatMessages,
    askQuestion,
    generateBudgetAdvisor,
    runExpenseCategorization,
  };
};

export default useAiAssistant;
