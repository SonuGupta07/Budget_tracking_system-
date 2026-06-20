import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SendIcon from "@mui/icons-material/Send";
import RefreshIcon from "@mui/icons-material/Refresh";
import PsychologyIcon from "@mui/icons-material/Psychology";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SavingsIcon from "@mui/icons-material/Savings";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CategoryIcon from "@mui/icons-material/Category";
import RepeatIcon from "@mui/icons-material/Repeat";

import PageHeader from "../../components/common/PageHeader";
import useAiAssistant from "../../hooks/useAiAssistant";

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

const SummaryCard = ({ title, value, subtitle, icon, color }) => {
  return (
    <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
      <CardContent>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Box>
            <Typography color="text.secondary" fontWeight={800}>
              {title}
            </Typography>

            <Typography variant="h5" fontWeight={900} mt={1}>
              {value}
            </Typography>

            <Typography variant="body2" color="text.secondary" mt={0.5}>
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

const AiAssistantPage = () => {
  const {
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
  } = useAiAssistant();

  const [question, setQuestion] = useState("");

  const quickPrompts = [
    "How is my spending this month?",
    "Where am I spending the most?",
    "How can I improve my savings?",
    "Am I overspending compared to my income?",
    "Give me practical budget advice.",
  ];

  const handleSend = async () => {
    if (!question.trim()) return;

    const currentQuestion = question;
    setQuestion("");
    await askQuestion(currentQuestion);
  };

  return (
    <Box>
      <PageHeader
        title="AI Financial Assistant"
        subtitle="GenAI-powered budget advisor, spending insights, savings recommendations and financial chatbot."
        breadcrumbs={["Insights", "AI Assistant"]}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Stack direction="row" justifyContent="flex-end" mb={3}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchAiData}
            >
              Refresh AI Context
            </Button>
          </Stack>

          <Grid container spacing={2.5} mb={3}>
            <Grid item xs={12} sm={6} lg={3}>
              <SummaryCard
                title="Income"
                value={formatCurrency(financialSummary.totalIncome)}
                subtitle="User-specific total income"
                icon={<TrendingUpIcon />}
                color="linear-gradient(135deg, #16a34a, #22c55e)"
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <SummaryCard
                title="Expense"
                value={formatCurrency(financialSummary.totalExpense)}
                subtitle={`${financialSummary.expenseRatio}% of income`}
                icon={<ReceiptLongIcon />}
                color="linear-gradient(135deg, #dc2626, #ef4444)"
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <SummaryCard
                title="Savings"
                value={`${financialSummary.savingsProgress}%`}
                subtitle={`${formatCurrency(financialSummary.currentSavings)} saved`}
                icon={<SavingsIcon />}
                color="linear-gradient(135deg, #059669, #10b981)"
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <SummaryCard
                title="Budget Usage"
                value={`${financialSummary.budgetUsage}%`}
                subtitle={`${formatCurrency(financialSummary.totalBudget)} planned`}
                icon={<PsychologyIcon />}
                color="linear-gradient(135deg, #2563eb, #7c3aed)"
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} lg={7}>
              <Card
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  height: "100%",
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <AutoAwesomeIcon color="primary" />
                    <Typography variant="h6" fontWeight={900}>
                      Financial Chatbot
                    </Typography>
                  </Stack>

                  <Box
                    sx={{
                      height: 420,
                      overflowY: "auto",
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 3,
                      p: 2,
                      mb: 2,
                      backgroundColor: "background.default",
                    }}
                  >
                    <Stack spacing={2}>
                      {chatMessages.map((message, index) => (
                        <Box
                          key={`${message.role}-${index}`}
                          sx={{
                            display: "flex",
                            justifyContent:
                              message.role === "user"
                                ? "flex-end"
                                : "flex-start",
                          }}
                        >
                          <Box
                            sx={{
                              maxWidth: "80%",
                              p: 1.6,
                              borderRadius: 3,
                              backgroundColor:
                                message.role === "user"
                                  ? "primary.main"
                                  : "action.hover",
                              color:
                                message.role === "user"
                                  ? "primary.contrastText"
                                  : "text.primary",
                            }}
                          >
                            <Typography variant="body2" whiteSpace="pre-line">
                              {message.text}
                            </Typography>
                          </Box>
                        </Box>
                      ))}

                      {chatLoading && (
                        <Typography color="text.secondary">
                          AI is thinking...
                        </Typography>
                      )}
                    </Stack>
                  </Box>

                  <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                    {quickPrompts.map((prompt) => (
                      <Chip
                        key={prompt}
                        label={prompt}
                        clickable
                        color="primary"
                        variant="outlined"
                        onClick={() => setQuestion(prompt)}
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Stack>

                  <TextField
                    fullWidth
                    placeholder="Ask about your spending, budget, savings or financial health..."
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleSend();
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            color="primary"
                            disabled={chatLoading || !question.trim()}
                            onClick={handleSend}
                          >
                            <SendIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={5}>
              <Stack spacing={3}>
                <Card
                  elevation={0}
                  sx={{ border: "1px solid", borderColor: "divider" }}
                >
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography variant="h6" fontWeight={900}>
                          AI Budget Advisor
                        </Typography>
                        <Typography color="text.secondary">
                          Generate personalized budget recommendations.
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        disabled={aiLoading}
                        onClick={generateBudgetAdvisor}
                      >
                        {aiLoading ? "Generating..." : "Generate"}
                      </Button>
                    </Stack>

                    {budgetAdvisor && (
                      <Alert
                        severity="info"
                        sx={{ mt: 2, whiteSpace: "pre-line" }}
                      >
                        {budgetAdvisor.recommendation}
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                <Card
                  elevation={0}
                  sx={{ border: "1px solid", borderColor: "divider" }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight={900} mb={2}>
                      AI Spending Insights
                    </Typography>

                    {!spendingInsights ? (
                      <Typography color="text.secondary">
                        Spending insights will appear after AI response loads.
                      </Typography>
                    ) : (
                      <Stack spacing={1.5}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography color="text.secondary">
                            Highest Category
                          </Typography>
                          <Typography fontWeight={900}>
                            {spendingInsights.highest_spending_category || "-"}
                          </Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between">
                          <Typography color="text.secondary">
                            Highest Amount
                          </Typography>
                          <Typography fontWeight={900} color="error.main">
                            {formatCurrency(
                              spendingInsights.highest_spending_amount,
                            )}
                          </Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between">
                          <Typography color="text.secondary">
                            Savings Rate
                          </Typography>
                          <Typography fontWeight={900}>
                            {spendingInsights.savings_rate || 0}%
                          </Typography>
                        </Stack>

                        <Alert severity="info" sx={{ whiteSpace: "pre-line" }}>
                          {spendingInsights.insights}
                        </Alert>
                      </Stack>
                    )}
                  </CardContent>
                </Card>

                <Card
                  elevation={0}
                  sx={{ border: "1px solid", borderColor: "divider" }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight={900} mb={2}>
                      AI Savings Recommendation
                    </Typography>

                    {!savingsRecommendation ? (
                      <Typography color="text.secondary">
                        No savings recommendation available.
                      </Typography>
                    ) : savingsRecommendation.message ? (
                      <Typography color="text.secondary">
                        {savingsRecommendation.message}
                      </Typography>
                    ) : (
                      <Stack spacing={1.5}>
                        <Typography fontWeight={900}>
                          {savingsRecommendation.goal_name}
                        </Typography>

                        <Typography color="text.secondary">
                          {formatCurrency(savingsRecommendation.current_amount)}{" "}
                          saved of{" "}
                          {formatCurrency(savingsRecommendation.target_amount)}
                        </Typography>

                        <Alert
                          severity="success"
                          sx={{ whiteSpace: "pre-line" }}
                        >
                          {savingsRecommendation.recommendation}
                        </Alert>
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              </Stack>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Card
                elevation={0}
                sx={{ border: "1px solid", borderColor: "divider" }}
              >
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <CategoryIcon color="primary" />
                    <Typography variant="h6" fontWeight={900}>
                      AI Expense Categorization
                    </Typography>
                  </Stack>

                  {recentExpenses.length === 0 ? (
                    <Typography color="text.secondary">
                      No expenses found for categorization.
                    </Typography>
                  ) : (
                    <Stack spacing={1.5}>
                      {recentExpenses.map((expense) => (
                        <Box
                          key={expense.expense_id}
                          sx={{
                            p: 1.5,
                            borderRadius: 3,
                            backgroundColor: "action.hover",
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={2}
                          >
                            <Box>
                              <Typography fontWeight={900}>
                                {expense.description || "Expense"}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {expense.category_name} •{" "}
                                {formatDate(expense.expense_date)}
                              </Typography>
                            </Box>

                            <Stack alignItems="flex-end" spacing={1}>
                              <Typography fontWeight={900} color="error.main">
                                {formatCurrency(expense.amount)}
                              </Typography>

                              <Button
                                size="small"
                                variant="outlined"
                                disabled={categorizing}
                                onClick={() =>
                                  runExpenseCategorization(expense)
                                }
                              >
                                Predict
                              </Button>
                            </Stack>
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  )}

                  {expensePrediction && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                      Expense #{expensePrediction.expense_id} predicted as{" "}
                      <strong>{expensePrediction.category}</strong> with{" "}
                      {expensePrediction.confidence}% confidence.
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Stack spacing={3}>
                <Card
                  elevation={0}
                  sx={{ border: "1px solid", borderColor: "divider" }}
                >
                  <CardContent>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      mb={2}
                    >
                      <WarningAmberIcon color="warning" />
                      <Typography variant="h6" fontWeight={900}>
                        AI Anomaly Detection
                      </Typography>
                    </Stack>

                    {anomalies.length === 0 ? (
                      <Typography color="text.secondary">
                        No unusual expenses detected.
                      </Typography>
                    ) : (
                      <Stack spacing={1.5}>
                        {anomalies.map((item) => (
                          <Alert
                            key={`${item.title}-${item.amount}-${item.date}`}
                            severity="warning"
                          >
                            <Typography fontWeight={900}>
                              {item.title}
                            </Typography>
                            <Typography variant="body2">
                              {item.message} Amount:{" "}
                              {formatCurrency(item.amount)} • Category:{" "}
                              {item.category}
                            </Typography>
                          </Alert>
                        ))}
                      </Stack>
                    )}
                  </CardContent>
                </Card>

                <Card
                  elevation={0}
                  sx={{ border: "1px solid", borderColor: "divider" }}
                >
                  <CardContent>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      mb={2}
                    >
                      <RepeatIcon color="secondary" />
                      <Typography variant="h6" fontWeight={900}>
                        Upcoming Recurring Context
                      </Typography>
                    </Stack>

                    {upcomingRecurring.length === 0 ? (
                      <Typography color="text.secondary">
                        No upcoming recurring transactions.
                      </Typography>
                    ) : (
                      <Stack spacing={1.5}>
                        {upcomingRecurring.map((item) => (
                          <Box
                            key={item.recurring_id}
                            sx={{
                              p: 1.5,
                              borderRadius: 3,
                              backgroundColor: "action.hover",
                            }}
                          >
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Box>
                                <Typography fontWeight={900}>
                                  {item.category_name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {item.frequency} • {item.days_remaining}{" "}
                                  day(s) left
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
              </Stack>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default AiAssistantPage;
