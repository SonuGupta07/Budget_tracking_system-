# Auto-generated placeholder: app/services/dashboard_service.py
from fastapi import HTTPException

from app.repositories.user_repository import (
    UserRepository
)

from app.repositories.analytics_repository import (
    AnalyticsRepository
)


class DashboardService:

    @staticmethod
    def get_dashboard(
        db,
        user_id: int
    ):

        user = UserRepository.get_by_id(
            db,
            user_id
        )

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        total_income = (
            AnalyticsRepository
            .get_total_income_by_user(
                db,
                user_id
            )
        )

        total_expense = (
            AnalyticsRepository
            .get_total_expense_by_user(
                db,
                user_id
            )
        )

        total_budget = (
            AnalyticsRepository
            .get_total_budget_by_user(
                db,
                user_id
            )
        )

        savings_target = (
            AnalyticsRepository
            .get_total_target_savings(
                db,
                user_id
            )
        )

        current_savings = (
            AnalyticsRepository
            .get_total_current_savings(
                db,
                user_id
            )
        )

        net_balance = (
            total_income
            - total_expense
        )

        savings_progress = 0

        if savings_target > 0:

            savings_progress = round(
                (
                    current_savings
                    / savings_target
                ) * 100,
                2
            )

        return {

            "user_id": user_id,

            "total_income":
            float(total_income),

            "total_expense":
            float(total_expense),

            "total_budget":
            float(total_budget),

            "net_balance":
            float(net_balance),

            "savings_target":
            float(savings_target),

            "current_savings":
            float(current_savings),

            "savings_progress":
            savings_progress
        }


dashboard_service = DashboardService()