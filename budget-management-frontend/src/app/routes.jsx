import { Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyOtp from "../pages/auth/VerifyOtp";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import ComingSoonPage from "../pages/common/ComingSoonPage";

import PublicRoute from "../routes/PublicRoute";
import ProtectedRoute from "../routes/ProtectedRoute";
import CategoryPage from "../pages/category/CategoryPage";
import IncomePage from "../pages/income/IncomePage";
import ExpensePage from "../pages/expense/ExpensePage";
import BudgetPage from "../pages/budget/BudgetPage";
import SavingsPage from "../pages/savings/SavingsPage";
import RecurringPage from "../pages/recurring/RecurringPage";
import AnalyticsPage from "../pages/analytics/AnalyticsPage";
import NotificationsPage from "../pages/notifications/NotificationsPage";
import AiAssistantPage from "../pages/ai/AiAssistantPage";
import SubscriptionPage from "../pages/subscription/SubscriptionPage";

const routes = [
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },

  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: "/verify-otp",
    element: (
      <PublicRoute>
        <VerifyOtp />
      </PublicRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <PublicRoute>
        <ForgotPassword />
      </PublicRoute>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <PublicRoute>
        <ResetPassword />
      </PublicRoute>
    ),
  },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "income",
        element: (
          <IncomePage
          />
        ),
      },
      {
        path: "expenses",
        element: (
          <ExpensePage
          />
        ),
      },
      {
        path: "budgets",
        element: (
          <BudgetPage
          />
        ),
      },
      {
        path: "savings",
        element: (
          <SavingsPage
          />
        ),
      },
      {
        path: "subscription",
        element:<SubscriptionPage/>

      },
      {
        path: "recurring",
        element: (
          <RecurringPage
          />
        ),
      },
      {
        path: "categories",
        element: (
          <CategoryPage
            
          />
        ),
      },
      {
        path: "analytics",
        element: (
          <AnalyticsPage
          />
        ),
      },
      {
        path: "notifications",
        element: (
          <NotificationsPage
          />
        ),
      },
      {
        path: "ai/budget-advisor",
        element: (
          <AiAssistantPage
          />
        ),
      },
      {
        path: "admin/users",
        element: (
          <ComingSoonPage
            title="User Management"
            subtitle="Admin module for managing users."
          />
        ),
      },
      {
        path: "admin/roles",
        element: (
          <ComingSoonPage
            title="Role Management"
            subtitle="Admin module for roles and permissions."
          />
        ),
      },
      {
        path: "admin/audit-logs",
        element: (
          <ComingSoonPage
            title="Audit Logs"
            subtitle="Track user actions and security activities."
          />
        ),
      },
      {
        path: "admin",
        element: (
          <ComingSoonPage
            title="Admin Panel"
            subtitle="Central admin area for system configuration."
          />
        ),
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
];

export default routes;
