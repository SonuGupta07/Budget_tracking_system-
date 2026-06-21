from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import text

from app.core.database import engine

from app.api.auth.auth_router import router as auth_router
from app.api.auth.otp_router import router as otp_router
from app.api.auth.password_router import router as password_router

from app.api.finance.category_router import router as category_router
from app.api.finance.income_router import router as income_router
from app.api.finance.expense_router import router as expense_router
from app.api.finance.budget_router import router as budget_router
from app.api.finance.savings_router import router as savings_router
from app.api.finance.recurring_router import router as recurring_router
from app.api.payment.payment_router import router as payment_router

from app.api.analytics.dashboard_router import (
    router as dashboard_router
)
from app.api.analytics.financial_health_router import (
    router as financial_health_router
)
from app.api.analytics.analytics_router import (
    router as analytics_router
)

from app.api.notification.notification_router import (
    router as notification_router
)

from app.api.ai.ai_router import router as ai_router


app = FastAPI(
    title="Budget Management System API"
)


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # "http://localhost:5173",
        # "http://127.0.0.1:5173",
        # "https://tassel-strode-bless.ngrok-free.dev"
        "*"
    
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# Health Check
# =========================

@app.get("/")
def health_check():

    with engine.connect() as conn:

        result = conn.execute(
            text("SELECT 1 FROM DUAL")
        )

        return {
            "status": "success",
            "database": "connected",
            "result": result.scalar()
        }


# =========================
# Authentication
# =========================

app.include_router(auth_router)
app.include_router(otp_router)
app.include_router(password_router)


# =========================
# Finance
# =========================

app.include_router(category_router)
app.include_router(income_router)
app.include_router(expense_router)
app.include_router(budget_router)
app.include_router(savings_router)
app.include_router(recurring_router)


# =========================
# Analytics
# =========================

app.include_router(dashboard_router)
app.include_router(financial_health_router)
app.include_router(analytics_router)


# =========================
# Notifications
# =========================

app.include_router(notification_router)


# =========================
# AI
# =========================

app.include_router(ai_router)
app.include_router(payment_router)