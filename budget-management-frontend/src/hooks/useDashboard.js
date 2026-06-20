import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAllBudgets,
  getAllCategories,
  getAllExpenses,
  getAllIncome,
  getAllRecurringTransactions,
  getAllSavingsGoals,
  getDashboardOverview,
  getFinancialHealth,
  getTrendAnalysis,
} from "../api/dashboardApi";
import { getUserIdFromToken } from "../utils/jwt";

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const normalizeArray = (data) => {
  if (Array.isArray(data)) return data;
  if (!data) return [];
  return [data];
};

const getYear = (dateValue) => {
  if (!dateValue) return null;
  return new Date(dateValue).getFullYear();
};

const getMonth = (dateValue) => {
  if (!dateValue) return null;
  return new Date(dateValue).getMonth() + 1;
};

const groupByCategory = (records, categories, amountKey) => {
  const categoryMap = {};

  categories.forEach((category) => {
    categoryMap[Number(category.category_id)] = category.category_name;
  });

  const grouped = {};

  records.forEach((record) => {
    const categoryName =
      categoryMap[Number(record.category_id)] || "Unknown Category";

    grouped[categoryName] =
      (grouped[categoryName] || 0) + Number(record[amountKey] || 0);
  });

  return Object.entries(grouped).map(([category, amount]) => ({
    category,
    amount,
  }));
};

const useDashboard = () => {
  const userId = useMemo(() => getUserIdFromToken(), []);

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState("ALL");

  const [overview, setOverview] = useState(null);
  const [financialHealth, setFinancialHealth] = useState(null);
  const [trend, setTrend] = useState(null);

  const [categories, setCategories] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [budgetList, setBudgetList] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [recurringList, setRecurringList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    if (!userId) {
      setError("User ID not found in token. Please login again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const results = await Promise.allSettled([
        getDashboardOverview(userId),
        getFinancialHealth(userId),
        getTrendAnalysis(userId),
        getAllCategories(),
        getAllIncome(),
        getAllExpenses(),
        getAllBudgets(),
        getAllSavingsGoals(),
        getAllRecurringTransactions(),
      ]);

      if (results[0].status === "fulfilled") setOverview(results[0].value);
      if (results[1].status === "fulfilled")
        setFinancialHealth(results[1].value);
      if (results[2].status === "fulfilled") setTrend(results[2].value);

      const allCategories =
        results[3].status === "fulfilled"
          ? normalizeArray(results[3].value)
          : [];

      const allIncome =
        results[4].status === "fulfilled"
          ? normalizeArray(results[4].value)
          : [];

      const allExpenses =
        results[5].status === "fulfilled"
          ? normalizeArray(results[5].value)
          : [];

      const allBudgets =
        results[6].status === "fulfilled"
          ? normalizeArray(results[6].value)
          : [];

      const allSavings =
        results[7].status === "fulfilled"
          ? normalizeArray(results[7].value)
          : [];

      const allRecurring =
        results[8].status === "fulfilled"
          ? normalizeArray(results[8].value)
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
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to load dashboard",
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const categoryMap = useMemo(() => {
    const map = {};

    categories.forEach((category) => {
      map[Number(category.category_id)] = category.category_name;
    });

    return map;
  }, [categories]);

  const yearIncome = useMemo(() => {
    return incomeList.filter(
      (item) => Number(getYear(item.income_date)) === Number(year),
    );
  }, [incomeList, year]);

  const yearExpenses = useMemo(() => {
    return expenseList.filter(
      (item) => Number(getYear(item.expense_date)) === Number(year),
    );
  }, [expenseList, year]);

  const periodIncome = useMemo(() => {
    if (month === "ALL") return yearIncome;

    return yearIncome.filter(
      (item) => Number(getMonth(item.income_date)) === Number(month),
    );
  }, [yearIncome, month]);

  const periodExpenses = useMemo(() => {
    if (month === "ALL") return yearExpenses;

    return yearExpenses.filter(
      (item) => Number(getMonth(item.expense_date)) === Number(month),
    );
  }, [yearExpenses, month]);

  const periodBudgets = useMemo(() => {
    return budgetList.filter((budget) => {
      const matchesYear = Number(budget.year) === Number(year);
      const matchesMonth =
        month === "ALL" || Number(budget.month) === Number(month);

      return matchesYear && matchesMonth;
    });
  }, [budgetList, year, month]);

  const monthlyCashFlow = useMemo(() => {
    return monthLabels.map((monthName, index) => {
      const monthNumber = index + 1;

      const income = yearIncome
        .filter((item) => Number(getMonth(item.income_date)) === monthNumber)
        .reduce((sum, item) => sum + Number(item.amount || 0), 0);

      const expense = yearExpenses
        .filter((item) => Number(getMonth(item.expense_date)) === monthNumber)
        .reduce((sum, item) => sum + Number(item.amount || 0), 0);

      return {
        month: monthName,
        income,
        expense,
        balance: income - expense,
      };
    });
  }, [yearIncome, yearExpenses]);

  const incomeDistribution = useMemo(() => {
    return groupByCategory(periodIncome, categories, "amount");
  }, [periodIncome, categories]);

  const expenseDistribution = useMemo(() => {
    return groupByCategory(periodExpenses, categories, "amount");
  }, [periodExpenses, categories]);

  const budgetCategorySummary = useMemo(() => {
    return periodBudgets.map((budget) => {
      const expenseForBudget = yearExpenses
        .filter((expense) => {
          const sameCategory =
            Number(expense.category_id) === Number(budget.category_id);

          const sameMonth =
            Number(getMonth(expense.expense_date)) === Number(budget.month);

          return sameCategory && sameMonth;
        })
        .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

      const budgetAmount = Number(budget.budget_amount || 0);

      return {
        category_id: budget.category_id,
        category_name: categoryMap[Number(budget.category_id)] || "Unknown",
        month: budget.month,
        year: budget.year,
        budget: budgetAmount,
        expense: expenseForBudget,
        remaining: budgetAmount - expenseForBudget,
        utilization_percentage:
          budgetAmount > 0
            ? Number(((expenseForBudget / budgetAmount) * 100).toFixed(2))
            : 0,
      };
    });
  }, [periodBudgets, yearExpenses, categoryMap]);

  const recentTransactions = useMemo(() => {
    const incomeTransactions = incomeList.map((item) => ({
      id: `income-${item.income_id}`,
      type: "INCOME",
      description: item.description,
      amount: Number(item.amount || 0),
      date: item.income_date,
      category: categoryMap[Number(item.category_id)] || "Income",
    }));

    const expenseTransactions = expenseList.map((item) => ({
      id: `expense-${item.expense_id}`,
      type: "EXPENSE",
      description: item.description,
      amount: Number(item.amount || 0),
      date: item.expense_date,
      category: categoryMap[Number(item.category_id)] || "Expense",
    }));

    return [...incomeTransactions, ...expenseTransactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8);
  }, [incomeList, expenseList, categoryMap]);

  const upcomingRecurring = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return recurringList
      .map((item) => {
        const nextDate = new Date(item.next_run_date);
        nextDate.setHours(0, 0, 0, 0);

        const daysLeft = Math.ceil(
          (nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );

        return {
          ...item,
          category_name: categoryMap[Number(item.category_id)] || "Unknown",
          days_left: daysLeft,
        };
      })
      .filter((item) => item.days_left >= 0)
      .sort((a, b) => a.days_left - b.days_left)
      .slice(0, 5);
  }, [recurringList, categoryMap]);

  const totals = useMemo(() => {
    const totalIncome = periodIncome.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0,
    );

    const totalExpense = periodExpenses.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0,
    );

    const totalBudget = periodBudgets.reduce(
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

    const savingsProgress =
      savingsTarget > 0
        ? Number(((currentSavings / savingsTarget) * 100).toFixed(2))
        : 0;

    const budgetUtilization =
      totalBudget > 0
        ? Number(((totalExpense / totalBudget) * 100).toFixed(2))
        : 0;

    return {
      totalIncome,
      totalExpense,
      totalBudget,
      netBalance: totalIncome - totalExpense,
      savingsTarget,
      currentSavings,
      savingsProgress,
      budgetUtilization,
      remainingBudget: totalBudget - totalExpense,
    };
  }, [periodIncome, periodExpenses, periodBudgets, savingsGoals]);

  const computedHealthScore = useMemo(() => {
    let score = 50;

    if (totals.totalIncome > 0) {
      const expenseRatio = totals.totalExpense / totals.totalIncome;
      const savingsRatio = totals.currentSavings / totals.totalIncome;

      if (expenseRatio <= 0.5) score += 20;
      else if (expenseRatio <= 0.75) score += 10;
      else score -= 10;

      if (savingsRatio >= 0.2) score += 20;
      else if (savingsRatio >= 0.1) score += 10;
    }

    if (totals.totalBudget > 0) {
      const budgetUsage = totals.totalExpense / totals.totalBudget;

      if (budgetUsage <= 0.8) score += 10;
      else if (budgetUsage > 1) score -= 15;
    }

    return Math.max(0, Math.min(100, score));
  }, [totals]);

  return {
    userId,
    year,
    setYear,
    month,
    setMonth,
    overview,
    financialHealth,
    trend,
    monthlyCashFlow,
    incomeDistribution,
    expenseDistribution,
    budgetCategorySummary,
    recentTransactions,
    upcomingRecurring,
    totals,
    computedHealthScore,
    loading,
    error,
    fetchDashboard,
  };
};

export default useDashboard;
