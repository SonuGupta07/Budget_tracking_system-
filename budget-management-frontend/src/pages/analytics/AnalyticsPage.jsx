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

import RefreshIcon from "@mui/icons-material/Refresh";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SavingsIcon from "@mui/icons-material/Savings";
import InsightsIcon from "@mui/icons-material/Insights";

import {
  Area,
  Bar,
  BarChart,
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
import useAnalyticsPage from "../../hooks/useAnalyticsPage";

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

const KpiCard = ({ title, value, subtitle, icon, color }) => {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
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

const ChartCard = ({ title, subtitle, children }) => {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight={900}>
          {title}
        </Typography>

        {subtitle && (
          <Typography color="text.secondary" mb={2}>
            {subtitle}
          </Typography>
        )}

        {children}
      </CardContent>
    </Card>
  );
};

const EmptyState = ({ text, height = 300 }) => {
  return (
    <Box
      sx={{
        height,
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
      <Typography color="text.secondary">{text}</Typography>
    </Box>
  );
};

const DonutChart = ({ data, emptyText }) => {
  if (!data || data.length === 0) {
    return <EmptyState text={emptyText} height={310} />;
  }

  return (
    <ResponsiveContainer width="100%" height={310}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="category"
          innerRadius={60}
          outerRadius={105}
          paddingAngle={3}
          label={({ category }) => category}
        >
          {data.map((entry, index) => (
            <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip formatter={(value) => formatCurrency(value)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

const AnalyticsPage = () => {
  const {
    filters,
    loading,
    error,
    fetchAnalytics,

    totals,
    monthlyCashFlow,
    incomeDistribution,
    expenseDistribution,
    incomeRanking,
    expenseRanking,
    budgetVsActual,
    savingsProgress,
    recurringSummary,
    recentTransactions,
    bestWorstMonths,
    smartInsights,

    backendExpensePie,
    backendMonthlyBar,
    backendYearlyBar,
    backendDateRangeSummary,
    backendTrend,
  } = useAnalyticsPage();

  return (
    <Box>
      <PageHeader
        title="Financial Analytics"
        subtitle="Deep drill-down analysis using backend analytics APIs plus interactive user-specific filtered analytics."
        breadcrumbs={["Insights", "Analytics"]}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          mb: 3,
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight={900} mb={2}>
            Analytics Filters
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Year"
                type="number"
                size="small"
                fullWidth
                value={filters.year}
                onChange={(event) => filters.setYear(event.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl size="small" fullWidth>
                <InputLabel>Month</InputLabel>
                <Select
                  label="Month"
                  value={filters.month}
                  onChange={(event) => filters.setMonth(event.target.value)}
                >
                  {monthOptions.map((item) => (
                    <MenuItem key={item.label} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2.5}>
              <TextField
                label="Start Date"
                type="date"
                size="small"
                fullWidth
                value={filters.startDate}
                onChange={(event) => filters.setStartDate(event.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2.5}>
              <TextField
                label="End Date"
                type="date"
                size="small"
                fullWidth
                value={filters.endDate}
                onChange={(event) => filters.setEndDate(event.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={fetchAnalytics}
                  fullWidth
                >
                  Apply
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<RestartAltIcon />}
                  onClick={filters.resetFilters}
                  fullWidth
                >
                  Reset
                </Button>
              </Stack>
            </Grid>
          </Grid>
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
                subtitle="Filtered income"
                icon={<TrendingUpIcon />}
                color="linear-gradient(135deg, #16a34a, #22c55e)"
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={2.4}>
              <KpiCard
                title="Expense"
                value={formatCurrency(totals.totalExpense)}
                subtitle={`${totals.expenseRatio}% of income`}
                icon={<ReceiptLongIcon />}
                color="linear-gradient(135deg, #dc2626, #ef4444)"
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={2.4}>
              <KpiCard
                title="Net Balance"
                value={formatCurrency(totals.netBalance)}
                subtitle={totals.netBalance >= 0 ? "Positive" : "Negative"}
                icon={<AccountBalanceWalletIcon />}
                color="linear-gradient(135deg, #2563eb, #7c3aed)"
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={2.4}>
              <KpiCard
                title="Budget Usage"
                value={`${totals.budgetUtilization}%`}
                subtitle={`${formatCurrency(totals.remainingBudget)} remaining`}
                icon={<InsightsIcon />}
                color="linear-gradient(135deg, #f59e0b, #ef4444)"
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={2.4}>
              <KpiCard
                title="Savings"
                value={`${totals.savingsProgress}%`}
                subtitle={`${formatCurrency(totals.currentSavings)} saved`}
                icon={<SavingsIcon />}
                color="linear-gradient(135deg, #059669, #10b981)"
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={4}>
              <ChartCard
                title="Backend Date Range Summary"
                subtitle="Official backend-calculated income, expense and balance."
              >
                {!backendDateRangeSummary ? (
                  <Typography color="text.secondary">
                    No backend date-range summary available.
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">Income</Typography>
                      <Typography fontWeight={900} color="success.main">
                        {formatCurrency(backendDateRangeSummary.total_income)}
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">Expense</Typography>
                      <Typography fontWeight={900} color="error.main">
                        {formatCurrency(backendDateRangeSummary.total_expense)}
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">
                        Net Balance
                      </Typography>
                      <Typography
                        fontWeight={900}
                        color={
                          Number(backendDateRangeSummary.net_balance || 0) >= 0
                            ? "success.main"
                            : "error.main"
                        }
                      >
                        {formatCurrency(backendDateRangeSummary.net_balance)}
                      </Typography>
                    </Stack>
                  </Stack>
                )}
              </ChartCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <ChartCard
                title="Backend Month Snapshot"
                subtitle="Official backend month/year income and expense."
              >
                {!backendMonthlyBar ? (
                  <Typography color="text.secondary">
                    No backend monthly snapshot available.
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">Income</Typography>
                      <Typography fontWeight={900} color="success.main">
                        {formatCurrency(backendMonthlyBar.income)}
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">Expense</Typography>
                      <Typography fontWeight={900} color="error.main">
                        {formatCurrency(backendMonthlyBar.expense)}
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">Balance</Typography>
                      <Typography fontWeight={900}>
                        {formatCurrency(
                          Number(backendMonthlyBar.income || 0) -
                            Number(backendMonthlyBar.expense || 0),
                        )}
                      </Typography>
                    </Stack>
                  </Stack>
                )}
              </ChartCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <ChartCard
                title="Backend Trend Analysis"
                subtitle="Official backend-generated trend insight."
              >
                {!backendTrend ? (
                  <Typography color="text.secondary">
                    No backend trend data available.
                  </Typography>
                ) : (
                  <Stack spacing={1.5}>
                    <Chip
                      label={`Income: ${backendTrend.income_trend || "STABLE"} (${
                        backendTrend.income_change_percent || 0
                      }%)`}
                      color={
                        backendTrend.income_trend === "INCREASING"
                          ? "success"
                          : backendTrend.income_trend === "DECREASING"
                            ? "warning"
                            : "default"
                      }
                      sx={{ fontWeight: 800 }}
                    />

                    <Chip
                      label={`Expense: ${
                        backendTrend.expense_trend || "STABLE"
                      } (${backendTrend.expense_change_percent || 0}%)`}
                      color={
                        backendTrend.expense_trend === "INCREASING"
                          ? "error"
                          : backendTrend.expense_trend === "DECREASING"
                            ? "success"
                            : "default"
                      }
                      sx={{ fontWeight: 800 }}
                    />

                    <Alert severity="info">
                      {backendTrend.summary ||
                        "Backend trend summary unavailable."}
                    </Alert>
                  </Stack>
                )}
              </ChartCard>
            </Grid>
          </Grid>

          <Grid container spacing={3} mb={3}>
            <Grid item xs={12}>
              <ChartCard
                title="Backend Yearly Income vs Expense"
                subtitle="Official backend-generated year-wise monthly data."
              >
                {backendYearlyBar.length === 0 ? (
                  <EmptyState
                    text="No backend yearly chart data available."
                    height={350}
                  />
                ) : (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={backendYearlyBar}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.35} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Bar
                        dataKey="income"
                        name="Backend Income"
                        fill="#16a34a"
                        radius={[8, 8, 0, 0]}
                      />
                      <Bar
                        dataKey="expense"
                        name="Backend Expense"
                        fill="#dc2626"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>
            </Grid>
          </Grid>

          <Grid container spacing={3} mb={3}>
            <Grid item xs={12}>
              <ChartCard
                title="Interactive Monthly Income, Expense and Net Balance"
                subtitle="Frontend-filtered yearly trend using raw user-specific APIs."
              >
                <ResponsiveContainer width="100%" height={380}>
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
                      maxBarSize={35}
                    />
                    <Bar
                      dataKey="expense"
                      name="Expense"
                      fill="#dc2626"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={35}
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
              </ChartCard>
            </Grid>
          </Grid>

          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={4}>
              <ChartCard
                title="Backend Expense Pie"
                subtitle="Backend all-time expense distribution."
              >
                <DonutChart
                  data={backendExpensePie}
                  emptyText="No backend expense pie data available."
                />
              </ChartCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <ChartCard
                title="Filtered Expense Distribution"
                subtitle="Expense distribution for selected filters."
              >
                <DonutChart
                  data={expenseDistribution}
                  emptyText="No filtered expense data found."
                />
              </ChartCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <ChartCard
                title="Filtered Income Distribution"
                subtitle="Income distribution for selected filters."
              >
                <DonutChart
                  data={incomeDistribution}
                  emptyText="No filtered income data found."
                />
              </ChartCard>
            </Grid>
          </Grid>

          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={6}>
              <ChartCard
                title="Top Expense Categories"
                subtitle="Highest spending categories for selected filters."
              >
                {expenseRanking.length === 0 ? (
                  <EmptyState
                    text="No expense ranking available."
                    height={330}
                  />
                ) : (
                  <ResponsiveContainer width="100%" height={330}>
                    <BarChart
                      data={expenseRanking}
                      layout="vertical"
                      margin={{ left: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.35} />
                      <XAxis type="number" />
                      <YAxis dataKey="category" type="category" width={120} />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar
                        dataKey="amount"
                        fill="#dc2626"
                        radius={[0, 8, 8, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>
            </Grid>

            <Grid item xs={12} md={6}>
              <ChartCard
                title="Top Income Sources"
                subtitle="Highest income categories for selected filters."
              >
                {incomeRanking.length === 0 ? (
                  <EmptyState
                    text="No income ranking available."
                    height={330}
                  />
                ) : (
                  <ResponsiveContainer width="100%" height={330}>
                    <BarChart
                      data={incomeRanking}
                      layout="vertical"
                      margin={{ left: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.35} />
                      <XAxis type="number" />
                      <YAxis dataKey="category" type="category" width={120} />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar
                        dataKey="amount"
                        fill="#16a34a"
                        radius={[0, 8, 8, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>
            </Grid>
          </Grid>

          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} lg={7}>
              <ChartCard
                title="Budget vs Actual"
                subtitle="Budget and actual expense comparison for selected filters."
              >
                {budgetVsActual.length === 0 ? (
                  <EmptyState text="No budget data found." height={360} />
                ) : (
                  <ResponsiveContainer width="100%" height={360}>
                    <BarChart data={budgetVsActual}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.35} />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Bar
                        dataKey="budget"
                        name="Budget"
                        fill="#2563eb"
                        radius={[8, 8, 0, 0]}
                      />
                      <Bar
                        dataKey="expense"
                        name="Actual Expense"
                        fill="#dc2626"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ChartCard>
            </Grid>

            <Grid item xs={12} lg={5}>
              <ChartCard
                title="Budget Utilization Matrix"
                subtitle="Budget usage percentage by category."
              >
                {budgetVsActual.length === 0 ? (
                  <Typography color="text.secondary">
                    No utilization records available.
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    {budgetVsActual.map((item) => (
                      <Box key={`${item.category}-${item.month}-${item.year}`}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography fontWeight={800}>
                            {item.category}
                          </Typography>
                          <Typography fontWeight={900}>
                            {item.utilization}%
                          </Typography>
                        </Stack>

                        <LinearProgress
                          variant="determinate"
                          value={Math.min(item.utilization, 100)}
                          color={
                            item.utilization >= 90
                              ? "error"
                              : item.utilization >= 70
                                ? "warning"
                                : "success"
                          }
                          sx={{ height: 9, borderRadius: 10, mt: 1 }}
                        />

                        <Typography variant="caption" color="text.secondary">
                          Remaining: {formatCurrency(item.remaining)}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                )}
              </ChartCard>
            </Grid>
          </Grid>

          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} lg={6}>
              <ChartCard
                title="Savings Goal Analysis"
                subtitle="Goal-wise savings progress for selected filters."
              >
                {savingsProgress.length === 0 ? (
                  <Typography color="text.secondary">
                    No savings goals found.
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    {savingsProgress.map((goal) => (
                      <Box key={goal.goal}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography fontWeight={800}>{goal.goal}</Typography>
                          <Typography fontWeight={900}>
                            {goal.progress}%
                          </Typography>
                        </Stack>

                        <LinearProgress
                          variant="determinate"
                          value={Math.min(goal.progress, 100)}
                          color={goal.progress >= 100 ? "success" : "primary"}
                          sx={{ height: 9, borderRadius: 10, mt: 1 }}
                        />

                        <Typography variant="caption" color="text.secondary">
                          {formatCurrency(goal.current)} saved of{" "}
                          {formatCurrency(goal.target)} • Target:{" "}
                          {formatDate(goal.target_date)}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                )}
              </ChartCard>
            </Grid>

            <Grid item xs={12} lg={6}>
              <ChartCard
                title="Recurring Transaction Analysis"
                subtitle="Recurring transactions for selected run-date filter."
              >
                {recurringSummary.length === 0 ? (
                  <Typography color="text.secondary">
                    No recurring transactions found.
                  </Typography>
                ) : (
                  <Stack spacing={1.5}>
                    {recurringSummary.map((item) => (
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
                              {item.category}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.transaction_type} • {item.frequency} •{" "}
                              {formatDate(item.next_run_date)}
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
              </ChartCard>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} lg={6}>
              <ChartCard
                title="Recent Transactions"
                subtitle="Latest filtered income and expense records."
              >
                {recentTransactions.length === 0 ? (
                  <Typography color="text.secondary">
                    No recent transactions found.
                  </Typography>
                ) : (
                  <Stack spacing={1.5}>
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

                            <Typography variant="body2" color="text.secondary">
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
              </ChartCard>
            </Grid>

            <Grid item xs={12} lg={6}>
              <ChartCard
                title="Smart Analytics Insights"
                subtitle="System-generated insights from selected user-specific data."
              >
                {smartInsights.length === 0 ? (
                  <Typography color="text.secondary">
                    Add financial data to generate smart insights.
                  </Typography>
                ) : (
                  <Stack spacing={1.5}>
                    {smartInsights.map((insight) => (
                      <Alert key={insight} severity="info">
                        {insight}
                      </Alert>
                    ))}
                  </Stack>
                )}

                <Box mt={3}>
                  <Typography variant="h6" fontWeight={900}>
                    Best / Worst Month
                  </Typography>

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    mt={1}
                  >
                    <Chip
                      label={`Best: ${
                        bestWorstMonths.bestMonth?.month || "-"
                      } (${formatCurrency(bestWorstMonths.bestMonth?.balance || 0)})`}
                      color="success"
                      sx={{ fontWeight: 800 }}
                    />

                    <Chip
                      label={`Worst: ${
                        bestWorstMonths.worstMonth?.month || "-"
                      } (${formatCurrency(bestWorstMonths.worstMonth?.balance || 0)})`}
                      color="error"
                      sx={{ fontWeight: 800 }}
                    />
                  </Stack>
                </Box>
              </ChartCard>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default AnalyticsPage;
