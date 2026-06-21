# 💰 BudgetPro - AI Powered Budget Management System

BudgetPro is a full-stack personal finance management platform built using React, FastAPI, Oracle Database, Gemini AI, Razorpay, Docker, and Jenkins.

The system helps users track income, expenses, budgets, savings goals, recurring transactions, financial analytics, notifications, AI-powered recommendations, and premium subscriptions.

---

# 🚀 Key Features

## Authentication & Authorization

- User Registration
- User Login
- JWT Authentication
- Protected APIs
- Password Reset via OTP
- Forgot Password Flow
- Secure Password Hashing

---

## Finance Management

### Category Management

- Create Category
- View Category
- Update Category
- Delete Category

Examples:

- Food
- Travel
- Shopping
- Bills
- Salary
- Healthcare
- Education

### Income Management

- Add Income
- View Income
- Update Income
- Delete Income

### Expense Management

- Add Expense
- View Expense
- Update Expense
- Delete Expense

### Budget Management

- Create Budget
- Update Budget
- Delete Budget
- Budget Utilization Tracking

### Savings Goals

- Create Savings Goal
- Update Savings Goal
- Delete Savings Goal
- Track Progress

### Recurring Transactions

- Monthly Rent
- Monthly Salary
- Insurance
- Subscriptions

---

# 📊 Dashboard

The dashboard provides a quick financial summary.

### Dashboard Widgets

- Total Income
- Total Expense
- Net Balance
- Budget Usage
- Savings Progress
- Recent Transactions
- Quick Charts

---

# 📈 Advanced Analytics

The Analytics module provides detailed financial insights.

### Features

- Year Filter
- Month Filter
- Date Range Filter
- Income KPI
- Expense KPI
- Net Balance
- Budget Utilization
- Savings Progress
- Category Wise Expense Distribution
- Monthly Cashflow Analysis
- Top Spending Categories
- Income Distribution
- Recurring Transaction Analysis
- Smart Financial Insights

### Analytics Questions Answered

- What is my current financial position?
- Why is my spending high?
- Which category costs the most?
- Which month had maximum expenses?
- Is my budget being exceeded?

---

# 🔔 Notifications & Alerts

## System Notifications

Users can:

- View Notifications
- Mark Notifications as Read
- Delete Notifications
- Create Notifications

## Smart Financial Alerts

Generated automatically from finance data.

Examples:

- Budget Exceeded
- Budget Usage Above 80%
- Savings Goal Overdue
- Savings Goal Due Soon
- Recurring Transaction Due Soon
- High Monthly Expense

---

# 🤖 AI Features

The AI module uses Gemini AI to provide intelligent financial assistance.

---

## AI Budget Advisor

Uses:

- Income
- Expenses
- Budgets
- Savings

Provides:

- Budget Recommendations
- Spending Optimization Suggestions

---

## AI Spending Insights

Analyzes:

- Highest Spending Category
- Total Income
- Total Expenses
- Savings Rate

Provides:

- Spending Observations
- Personalized Suggestions

---

## AI Savings Recommendation

Uses savings goal data and current financial position.

Provides:

- Personalized Savings Advice
- Goal Completion Recommendations

---

## AI Expense Categorization

### Flow

1. User enters expense description
2. Frontend sends description
3. Backend sends prompt to Gemini AI
4. AI predicts category
5. Backend stores prediction
6. Frontend displays category and confidence score

Example:

Input:

Trip to Goa ₹12000

Output:

Category: Travel

Confidence: 92%

---

## AI Financial Chatbot

Users can ask:

- How much did I spend this month?
- What is my biggest expense category?
- How can I save more money?
- Am I exceeding my budget?

Flow:

1. User asks question
2. Backend gathers financial context
3. Gemini generates response
4. Chat history is stored
5. Response displayed to user

---

# 💳 Razorpay Payment Integration

BudgetPro supports Premium Membership using Razorpay Test Mode.

---

## Payment Flow

1. User clicks Subscribe
2. Frontend calls:

POST /payments/create-order

3. Backend creates Razorpay Order

4. Razorpay Checkout opens

5. User completes payment

6. Razorpay returns:

- Payment ID
- Order ID
- Signature

7. Frontend calls:

POST /payments/verify-payment

8. Backend verifies signature

9. User becomes Premium Member

---

## Payment Security

- Razorpay Secret Key stored only in backend
- Signature verification prevents tampering
- Premium access granted only after successful verification

---

# 🌐 API Overview

## Authentication APIs

```http
POST /auth/register
POST /auth/login
POST /auth/forgot-password
POST /auth/verify-otp
POST /auth/reset-password
```

## Category APIs

```http
GET /categories
POST /categories
PUT /categories/{category_id}
DELETE /categories/{category_id}
```

## Income APIs

```http
GET /income
POST /income
PUT /income/{income_id}
DELETE /income/{income_id}
```

## Expense APIs

```http
GET /expense
POST /expense
PUT /expense/{expense_id}
DELETE /expense/{expense_id}
```

## Budget APIs

```http
GET /budget
POST /budget
PUT /budget/{budget_id}
DELETE /budget/{budget_id}
```

## Savings APIs

```http
GET /savings
POST /savings
PUT /savings/{goal_id}
DELETE /savings/{goal_id}
GET /savings/progress/{goal_id}
```

## Recurring APIs

```http
GET /recurring
POST /recurring
PUT /recurring/{recurring_id}
DELETE /recurring/{recurring_id}
```

## Analytics APIs

```http
GET /analytics/pie-chart/{user_id}
GET /analytics/bar-chart/{user_id}
GET /analytics/trend/{user_id}
```

## Notification APIs

```http
POST /notifications
GET /notifications/{user_id}
PUT /notifications/read/{notification_id}
DELETE /notifications/{notification_id}
```

## AI APIs

```http
POST /ai/categorize-expense
POST /ai/budget-advisor
GET /ai/spending-insights/{user_id}
GET /ai/savings-recommendation/{user_id}
POST /ai/financial-chatbot
```

## Payment APIs

```http
GET /payments/status/{user_id}
POST /payments/create-order
POST /payments/verify-payment
```

---

# 🏗 High Level Architecture

```text
User
 │
 ▼
React Frontend
 │
Axios API Calls
 │
 ▼
FastAPI Backend
 │
 ├── Router Layer
 ├── Schema Layer
 ├── Service Layer
 ├── Repository Layer
 ├── AI Layer
 ├── Payment Layer
 │
 ▼
Oracle Database

External Services
 ├── Gemini AI
 └── Razorpay
```

---

# 🎨 Frontend Architecture

Technology Stack:

- React
- Vite
- Axios
- React Router
- Material UI
- Recharts

Structure:

```text
src/
├── api/
├── hooks/
├── pages/
├── components/
├── routes/
└── utils/
```

---

# ⚙ Backend Architecture

Technology Stack:

- FastAPI
- Python
- SQLAlchemy
- Oracle Database
- JWT Authentication

Layers:

```text
Router Layer
Schema Layer
Service Layer
Repository Layer
Model Layer
Oracle Database
```

---

# 🗄 Database Design

Main Tables

```text
USERS
CATEGORIES
INCOME
EXPENSE
BUDGET
SAVINGS
RECURRING_TRANSACTIONS
NOTIFICATIONS
AI_EXPENSE_CATEGORIZATION
AI_BUDGET_RECOMMENDATIONS
AI_CHAT_HISTORY
PAYMENTS
USER_PREMIUM_STATUS
```

---

# 🔐 Authentication Flow

```text
User Login
    │
    ▼
POST /auth/login
    │
    ▼
Backend validates credentials
    │
    ▼
JWT Token Generated
    │
    ▼
Stored in localStorage
    │
    ▼
Axios attaches token
    │
    ▼
Protected APIs Accessible
```

---

# 🐳 Docker Architecture

Containers:

```text
budgetpro-oracle
budgetpro-backend
budgetpro-frontend
```

Runtime:

```text
Browser
   │
React Frontend Container
   │
FastAPI Backend Container
   │
Oracle Database Container
```

---

# 🐳 Docker Compose Commands

Start:

```bash
docker compose up -d
```

Stop:

```bash
docker compose down
```

Rebuild:

```bash
docker compose up --build -d
```

Logs:

```bash
docker compose logs -f
```

---

# 🔄 Jenkins CI/CD Pipeline

Pipeline Flow

```text
Developer Pushes Code
        │
        ▼
GitHub
        │
        ▼
Jenkins Checkout
        │
        ▼
Build Backend Image
        │
        ▼
Build Frontend Image
        │
        ▼
Deploy Using Docker Compose
        │
        ▼
Application Available
```

Stages

- Checkout
- Build Backend
- Build Frontend
- Docker Image Creation
- Deployment
- Verification

---

# 💻 Local Development Setup

Backend

```bash
python -m venv env
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend URL

```text
http://localhost:8000/docs
```

Frontend

```bash
npm install
npm run dev
```

Frontend URL

```text
http://localhost:5173
```

---

# 📋 Recommended Demo Flow

1. Login
2. Add Income
3. Add Expense
4. Create Budget
5. Create Savings Goal
6. Open Dashboard
7. View Analytics
8. Show Notifications
9. Demonstrate AI Features
10. Demonstrate Razorpay Payment Flow
11. Explain Docker Containers
12. Explain Jenkins Pipeline

---

# 🎤 Interview Talking Points

### Frontend

- React Hooks
- Axios Interceptors
- React Router
- Reusable Components

### Backend

- FastAPI Architecture
- JWT Authentication
- Service Layer Pattern
- Repository Pattern

### Database

- Oracle Database
- SQLAlchemy ORM
- Relationships
- Transactions

### AI

- Gemini Integration
- Prompt Engineering
- Expense Categorization

### DevOps

- Docker
- Docker Compose
- Jenkins
- CI/CD Pipeline

---

# 🚀 Future Enhancements

- Mobile Application
- Email Notification Service
- WhatsApp Alerts
- Subscription Billing
- Razorpay Webhooks
- Predictive Expense Forecasting
- Multi Currency Support
- Prometheus Monitoring
- Grafana Dashboards
- Automated Testing Pipeline

---

# 📄 Resume Description

Developed a full-stack AI-powered Budget Management System using React, FastAPI, Oracle Database, Docker, Jenkins, Gemini AI, and Razorpay. Implemented JWT authentication, expense tracking, budget planning, savings goals, analytics dashboards, AI-driven recommendations, premium subscription management, and containerized deployment architecture.

---

# 👨‍💻 Author

Sonu Gupta

BudgetPro – AI Powered Budget Management System

Built for demonstrating modern Full Stack Development, AI Integration, Payment Gateway Integration, Containerization, and CI/CD practices.