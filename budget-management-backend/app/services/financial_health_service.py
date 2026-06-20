from datetime import datetime

from fastapi import HTTPException

from app.models.financial_health import (
    FinancialHealthScore
)

from app.repositories.user_repository import (
    UserRepository
)

from app.repositories.analytics_repository import (
    AnalyticsRepository
)

from app.repositories.financial_health_repository import (
    FinancialHealthRepository
)


class FinancialHealthService:

    @staticmethod
    def generate_score(
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

        score = 0

        reasons = []

        # Income vs Expense (40)

        if total_income > total_expense:
            score += 40
            reasons.append(
                "Income exceeds expenses"
            )

        # Savings Progress (30)

        if savings_target > 0:

            progress = (
                current_savings
                / savings_target
            ) * 100

            if progress >= 50:
                score += 30

            elif progress >= 25:
                score += 20

            elif progress >= 10:
                score += 10

            reasons.append(
                f"Savings progress {round(progress,2)}%"
            )

        # Budget Utilization (30)

        if total_budget > 0:

            utilization = (
                total_expense
                / total_budget
            ) * 100

            if utilization <= 70:
                score += 30

            elif utilization <= 90:
                score += 20

            else:
                score += 10

            reasons.append(
                f"Budget utilization {round(utilization,2)}%"
            )

        status = "POOR"

        if score >= 80:
            status = "EXCELLENT"

        elif score >= 60:
            status = "GOOD"

        elif score >= 40:
            status = "AVERAGE"

        record = FinancialHealthScore(

            score_id=
            FinancialHealthRepository
            .get_next_id(db),

            user_id=user_id,

            score=score,

            generated_at=
            datetime.now()
        )

        FinancialHealthRepository.create(
            db,
            record
        )

        return {
            "user_id": user_id,
            "score": score,
            "status": status,
            "reasons": reasons
        }


financial_health_service = (
    FinancialHealthService()
)