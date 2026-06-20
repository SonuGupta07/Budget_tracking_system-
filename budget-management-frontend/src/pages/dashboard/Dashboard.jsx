import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SavingsIcon from "@mui/icons-material/Savings";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import RefreshIcon from "@mui/icons-material/Refresh";
import InsightsIcon from "@mui/icons-material/Insights";
import RepeatIcon from "@mui/icons-material/Repeat";

import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import PageHeader from "../../components/common/PageHeader";
import useDashboard from "../../hooks/useDashboard";

const COLORS = [
  "#2563eb",
  "#dc2626",
  "#16a34a",
  "#7c3aed",
  "#f59e0b",
  "#0891b2",
  "#db2777",
  "#65a30d",
];

const monthOptions = [
  { label: "All Months", value: "ALL" },
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

const formatDate = (value) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const getHealthLabel = (score) => {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Average";
  return "Needs Attention";
};

const getHealthColor = (score) => {
  if (score >= 80) return "success";
  if (score >= 60) return "primary";
  if (score >= 40) return "warning";
  return "error";
};

const KpiCard = ({ title, value, subtitle, icon, color }) => {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))",
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Box>
            <Typography color="text.secondary" fontWeight={800}>
              {title}
            </Typography>

            <Typography variant="h5" fontWeight={900} mt={1}>
              {value}
            </Typography>

            <Typography variant="body2" color="text.secondary" mt={0.6}>
              {subtitle}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: color,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

const DonutChartCard = ({ title, subtitle, data, emptyText }) => {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight={900}>
          {title}
        </Typography>

        <Typography color="text.secondary" mb={2}>
          {subtitle}
        </Typography>

        {data.length === 0 ? (
          <Box
            sx={{
              height: 280,
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              px: 2,
            }}
          >
            <Typography color="text.secondary">{emptyText}</Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="category"
                innerRadius={55}
                outerRadius={100}
                paddingAngle={3}
                label={({ category }) => category}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.category}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const {
    year,
    setYear,
    month,
    setMonth,
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
  } = useDashboard();

  const expenseRatio =
    totals.totalIncome > 0
      ? ((totals.totalExpense / totals.totalIncome) * 100).toFixed(1)
      : "0.0";

  return (
    <Box>
      <PageHeader
        title="Financial Intelligence Dashboard"
        subtitle="Power BI-style view of income, expenses, savings, budgets, recurring transactions and financial health."
        breadcrumbs={["Overview", "Dashboard"]}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card
        elevation={0}
        sx={{
          mb: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
          >
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Policy / Dashboard Year"
                type="number"
                size="small"
                value={year}
                onChange={(event) => setYear(event.target.value)}
                sx={{ width: { xs: "100%", sm: 180 } }}
              />

              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Month Filter</InputLabel>
                <Select
                  label="Month Filter"
                  value={month}
                  onChange={(event) => setMonth(event.target.value)}
                >
                  {monthOptions.map((item) => (
                    <MenuItem key={item.label} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={fetchDashboard}
            >
              Refresh Intelligence
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {loading ? (
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={2.5} mb={3}>
            <Grid item xs={12} sm={6} lg={2.4}>
              <KpiCard
                title="Income"
                value={formatCurrency(totals.totalIncome)}
                subtitle={`${year} selected period`}
                icon={<TrendingUpIcon />}
                color="linear-gradient(135deg, #16a34a, #22c55e)"
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={2.4}>
              <KpiCard
                title="Expense"
                value={formatCurrency(totals.totalExpense)}
                subtitle={`${expenseRatio}% of income`}
                icon={<ReceiptLongIcon />}
                color="linear-gradient(135deg, #dc2626, #ef4444)"
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={2.4}>
              <KpiCard
                title="Balance"
                value={formatCurrency(totals.netBalance)}
                subtitle={
                  totals.netBalance >= 0 ? "Positive cash flow" : "Overspent"
                }
                icon={<AccountBalanceWalletIcon />}
                color="linear-gradient(135deg, #2563eb, #7c3aed)"
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={2.4}>
              <KpiCard
                title="Savings"
                value={`${totals.savingsProgress.toFixed(1)}%`}
                subtitle={`${formatCurrency(totals.currentSavings)} saved`}
                icon={<SavingsIcon />}
                color="linear-gradient(135deg, #059669, #10b981)"
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={2.4}>
              <KpiCard
                title="Health"
                value={`${computedHealthScore}/100`}
                subtitle={getHealthLabel(computedHealthScore)}
                icon={<HealthAndSafetyIcon />}
                color="linear-gradient(135deg, #0891b2, #2563eb)"
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} lg={8}>
              <Card
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  minHeight: 470,
                }}
              >
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" mb={2}>
                    <Box>
                      <Typography variant="h6" fontWeight={900}>
                        Cash Flow Performance
                      </Typography>
                      <Typography color="text.secondary">
                        Income, expense and net balance month-wise for {year}.
                      </Typography>
                    </Box>

                    <Chip
                      label={year}
                      color="primary"
                      sx={{ fontWeight: 800 }}
                    />
                  </Stack>

                  <ResponsiveContainer width="100%" height={360}>
                    <ComposedChart data={monthlyCashFlow}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.35} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />

                      <Bar
                        dataKey="income"
                        name="Income"
                        fill="#16a34a"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={34}
                      />

                      <Bar
                        dataKey="expense"
                        name="Expense"
                        fill="#dc2626"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={34}
                      />

                      <Area
                        type="monotone"
                        dataKey="balance"
                        name="Balance Area"
                        fill="#2563eb"
                        stroke="none"
                        fillOpacity={0.08}
                      />

                      <Line
                        type="monotone"
                        dataKey="balance"
                        name="Net Balance"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Stack spacing={3}>
                <Card
                  elevation={0}
                  sx={{ border: "1px solid", borderColor: "divider" }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight={900}>
                      Budget Utilization
                    </Typography>

                    <Typography variant="h3" fontWeight={900} mt={1}>
                      {totals.budgetUtilization.toFixed(1)}%
                    </Typography>

                    <LinearProgress
                      variant="determinate"
                      value={Math.min(totals.budgetUtilization, 100)}
                      color={
                        totals.budgetUtilization >= 90
                          ? "error"
                          : totals.budgetUtilization >= 70
                            ? "warning"
                            : "success"
                      }
                      sx={{ height: 12, borderRadius: 10, mt: 2 }}
                    />

                    <Stack spacing={1.2} mt={2}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary">Budget</Typography>
                        <Typography fontWeight={900}>
                          {formatCurrency(totals.totalBudget)}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary">Expense</Typography>
                        <Typography fontWeight={900} color="error.main">
                          {formatCurrency(totals.totalExpense)}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary">
                          Remaining
                        </Typography>
                        <Typography
                          fontWeight={900}
                          color={
                            totals.remainingBudget < 0
                              ? "error.main"
                              : "success.main"
                          }
                        >
                          {formatCurrency(totals.remainingBudget)}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>

                <Card
                  elevation={0}
                  sx={{ border: "1px solid", borderColor: "divider" }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight={900}>
                      Financial Health
                    </Typography>

                    <Typography variant="h3" fontWeight={900} mt={1}>
                      {computedHealthScore}
                    </Typography>

                    <Chip
                      label={getHealthLabel(computedHealthScore)}
                      color={getHealthColor(computedHealthScore)}
                      sx={{ mt: 1, fontWeight: 800 }}
                    />

                    <LinearProgress
                      variant="determinate"
                      value={computedHealthScore}
                      color={getHealthColor(computedHealthScore)}
                      sx={{ height: 12, borderRadius: 10, mt: 2 }}
                    />
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>

          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={6}>
              <DonutChartCard
                title="Expense Distribution"
                subtitle={`Category-wise expenses for selected period in ${year}.`}
                data={expenseDistribution}
                emptyText={`No expense data found for selected period in ${year}.`}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <DonutChartCard
                title="Income Distribution"
                subtitle={`Category-wise income for selected period in ${year}.`}
                data={incomeDistribution}
                emptyText={`No income data found for selected period in ${year}.`}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} lg={6}>
              <Card
                elevation={0}
                sx={{ border: "1px solid", borderColor: "divider" }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={900} mb={2}>
                    Category Budget Matrix
                  </Typography>

                  {budgetCategorySummary.length === 0 ? (
                    <Typography color="text.secondary">
                      No budget summary available for selected period.
                    </Typography>
                  ) : (
                    <Stack spacing={2}>
                      {budgetCategorySummary.slice(0, 8).map((item) => (
                        <Box key={`${item.category_id}-${item.month}`}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography fontWeight={800}>
                              {item.category_name}
                            </Typography>

                            <Typography fontWeight={900}>
                              {formatCurrency(item.expense)} /{" "}
                              {formatCurrency(item.budget)}
                            </Typography>
                          </Stack>

                          <LinearProgress
                            variant="determinate"
                            value={Math.min(item.utilization_percentage, 100)}
                            color={
                              item.utilization_percentage >= 90
                                ? "error"
                                : item.utilization_percentage >= 70
                                  ? "warning"
                                  : "success"
                            }
                            sx={{ height: 9, borderRadius: 10, mt: 1 }}
                          />

                          <Typography variant="caption" color="text.secondary">
                            Remaining: {formatCurrency(item.remaining)} • Usage:{" "}
                            {item.utilization_percentage}%
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Card
                elevation={0}
                sx={{ border: "1px solid", borderColor: "divider" }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={900} mb={2}>
                    Recent Transactions
                  </Typography>

                  {recentTransactions.length === 0 ? (
                    <Typography color="text.secondary">
                      No recent transactions found.
                    </Typography>
                  ) : (
                    <Stack spacing={1.4}>
                      {recentTransactions.map((item) => (
                        <Box
                          key={item.id}
                          sx={{
                            p: 1.5,
                            borderRadius: 3,
                            backgroundColor: "action.hover",
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between">
                            <Box>
                              <Typography fontWeight={900}>
                                {item.description || item.category}
                              </Typography>

                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {item.category} • {formatDate(item.date)}
                              </Typography>
                            </Box>

                            <Typography
                              fontWeight={900}
                              color={
                                item.type === "INCOME"
                                  ? "success.main"
                                  : "error.main"
                              }
                            >
                              {item.type === "INCOME" ? "+" : "-"}
                              {formatCurrency(item.amount)}
                            </Typography>
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <Card
                elevation={0}
                sx={{ border: "1px solid", borderColor: "divider" }}
              >
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <RepeatIcon color="secondary" />
                    <Typography variant="h6" fontWeight={900}>
                      Upcoming Recurring Transactions
                    </Typography>
                  </Stack>

                  {upcomingRecurring.length === 0 ? (
                    <Typography color="text.secondary">
                      No upcoming recurring transactions.
                    </Typography>
                  ) : (
                    <Stack spacing={1.4}>
                      {upcomingRecurring.map((item) => (
                        <Box
                          key={item.recurring_id}
                          sx={{
                            p: 1.5,
                            borderRadius: 3,
                            backgroundColor: "action.hover",
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between">
                            <Box>
                              <Typography fontWeight={900}>
                                {item.category_name}
                              </Typography>

                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {item.frequency} •{" "}
                                {formatDate(item.next_run_date)} •{" "}
                                {item.days_left} day(s) left
                              </Typography>
                            </Box>

                            <Typography
                              fontWeight={900}
                              color={
                                item.transaction_type === "INCOME"
                                  ? "success.main"
                                  : "error.main"
                              }
                            >
                              {formatCurrency(item.amount)}
                            </Typography>
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Card
                elevation={0}
                sx={{ border: "1px solid", borderColor: "divider" }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={900} mb={2}>
                    Smart Trend Insight
                  </Typography>

                  {!trend ? (
                    <Typography color="text.secondary">
                      Add income and expense records to view trend insights.
                    </Typography>
                  ) : (
                    <Stack spacing={2}>
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={2}
                      >
                        <Chip
                          label={`Income: ${trend.income_trend || "STABLE"} (${
                            trend.income_change_percent || 0
                          }%)`}
                          color={
                            trend.income_trend === "INCREASING"
                              ? "success"
                              : trend.income_trend === "DECREASING"
                                ? "warning"
                                : "default"
                          }
                          sx={{ fontWeight: 800 }}
                        />

                        <Chip
                          label={`Expense: ${trend.expense_trend || "STABLE"} (${
                            trend.expense_change_percent || 0
                          }%)`}
                          color={
                            trend.expense_trend === "INCREASING"
                              ? "error"
                              : trend.expense_trend === "DECREASING"
                                ? "success"
                                : "default"
                          }
                          sx={{ fontWeight: 800 }}
                        />
                      </Stack>

                      <Alert severity="info">
                        {trend.summary || "Trend summary not available."}
                      </Alert>
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
