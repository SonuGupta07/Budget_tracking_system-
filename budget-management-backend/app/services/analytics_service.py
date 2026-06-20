from fastapi import HTTPException
from datetime import datetime

from app.repositories.user_repository import (
    UserRepository
)

from app.repositories.analytics_repository import (
    AnalyticsRepository
)


class AnalyticsService:

    @staticmethod
    def get_expense_distribution(
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

        result = (
            AnalyticsRepository
            .get_expense_distribution(
                db,
                user_id
            )
        )

        response = []

        for row in result:

            response.append({

                "category":
                row.category_name,

                "amount":
                float(
                    row.total_amount
                )
            })

        return response

    @staticmethod
    def income_expense_bar_chart(
        db,
        user_id,
        month,
        year
    ):

        return (
            AnalyticsRepository
            .get_income_expense_by_month(
                db,
                user_id,
                month,
                year
            )
        )

    @staticmethod
    def income_expense_year_chart(
        db,
        user_id,
        year
    ):

        return (
            AnalyticsRepository
            .get_income_expense_by_year(
                db,
                user_id,
                year
            )
        )

    @staticmethod
    def income_expense_date_range(
        db,
        user_id,
        start_date,
        end_date
    ):

        return (
            AnalyticsRepository
            .get_income_expense_by_date_range(
                db,
                user_id,
                start_date,
                end_date
            )
        )

    @staticmethod
    def get_trend_analysis(
        db,
        user_id
    ):

        today = datetime.now()

        current_month = today.month
        current_year = today.year

        previous_month = current_month - 1
        previous_year = current_year

        if previous_month == 0:

            previous_month = 12
            previous_year -= 1

        current_income = (
            AnalyticsRepository
            .get_month_income(
                db,
                user_id,
                current_month,
                current_year
            )
        )

        previous_income = (
            AnalyticsRepository
            .get_month_income(
                db,
                user_id,
                previous_month,
                previous_year
            )
        )

        current_expense = (
            AnalyticsRepository
            .get_month_expense(
                db,
                user_id,
                current_month,
                current_year
            )
        )

        previous_expense = (
            AnalyticsRepository
            .get_month_expense(
                db,
                user_id,
                previous_month,
                previous_year
            )
        )

        current_savings = (
            AnalyticsRepository
            .get_total_savings(
                db,
                user_id
            )
        )

        def calculate_change(
            current,
            previous
        ):

            if previous == 0:

                if current > 0:
                    return 100

                return 0

            return round(
                (
                    (
                        current - previous
                    )
                    /
                    previous
                ) * 100,
                2
            )

        income_change = calculate_change(
            current_income,
            previous_income
        )

        expense_change = calculate_change(
            current_expense,
            previous_expense
        )

        def trend(value):

            if value > 0:
                return "INCREASING"

            if value < 0:
                return "DECREASING"

            return "STABLE"

        return {

            "income_trend":
            trend(
                income_change
            ),

            "income_change_percent":
            income_change,

            "expense_trend":
            trend(
                expense_change
            ),

            "expense_change_percent":
            expense_change,

            "savings_trend":
            "IMPROVING",

            "current_savings":
            float(
                current_savings
            ),

            "summary":
            f"Income changed by {income_change}% and expenses changed by {expense_change}%."
        }


analytics_service = AnalyticsService()