from sqlalchemy import func

from app.models.income import Income
from app.models.expense import Expense
from app.models.budget import Budget
from app.models.savings_goal import SavingsGoal
from sqlalchemy import func,extract

from app.models.expense import Expense
from app.models.category import Category

class AnalyticsRepository:

    @staticmethod
    def get_total_income_by_user(
        db,
        user_id
    ):

        total = (
            db.query(
                func.sum(
                    Income.amount
                )
            )
            .filter(
                Income.user_id == user_id
            )
            .scalar()
        )

        return total or 0

    @staticmethod
    def get_total_expense_by_user(
        db,
        user_id
    ):

        total = (
            db.query(
                func.sum(
                    Expense.amount
                )
            )
            .filter(
                Expense.user_id == user_id
            )
            .scalar()
        )

        return total or 0

    @staticmethod
    def get_total_budget_by_user(
        db,
        user_id
    ):

        total = (
            db.query(
                func.sum(
                    Budget.budget_amount
                )
            )
            .filter(
                Budget.user_id == user_id
            )
            .scalar()
        )

        return total or 0

    @staticmethod
    def get_total_target_savings(
        db,
        user_id
    ):

        total = (
            db.query(
                func.sum(
                    SavingsGoal.target_amount
                )
            )
            .filter(
                SavingsGoal.user_id == user_id
            )
            .scalar()
        )

        return total or 0

    @staticmethod
    def get_total_current_savings(
        db,
        user_id
    ):

        total = (
            db.query(
                func.sum(
                    SavingsGoal.current_amount
                )
            )
            .filter(
                SavingsGoal.user_id == user_id
            )
            .scalar()
        )

        return total or 0
    @staticmethod
    def get_expense_distribution(
    db,
    user_id: int
):

     return (
        db.query(
            Category.category_name,
            func.sum(
                Expense.amount
            ).label(
                "total_amount"
            )
        )
        .join(
            Category,
            Expense.category_id
            ==
            Category.category_id
        )
        .filter(
            Expense.user_id
            ==
            user_id
        )
        .group_by(
            Category.category_name
        )
        .all()
    )
    from sqlalchemy import func, extract

    @staticmethod
    def get_income_expense_by_month(
    db,
    user_id,
    month,
    year
):
     income = (
        db.query(
            func.sum(Income.amount)
        )
        .filter(
            Income.user_id == user_id,
            extract("month", Income.income_date) == month,
            extract("year", Income.income_date) == year
        )
        .scalar()
    ) or 0

     expense = (
        db.query(
            func.sum(Expense.amount)
        )
        .filter(
            Expense.user_id == user_id,
            extract("month", Expense.expense_date) == month,
            extract("year", Expense.expense_date) == year
        )
        .scalar()
    ) or 0

     return {
        "income": float(income),
        "expense": float(expense)
    }
    

    @staticmethod
    def get_income_expense_by_year(
    db,
    user_id,
    year
):

     result = []

     months = [
        "Jan","Feb","Mar","Apr",
        "May","Jun","Jul","Aug",
        "Sep","Oct","Nov","Dec"
    ]

     for month in range(1, 13):

        income = (
            db.query(
                func.sum(
                    Income.amount
                )
            )
            .filter(
                Income.user_id == user_id,
                extract(
                    "month",
                    Income.income_date
                ) == month,
                extract(
                    "year",
                    Income.income_date
                ) == year
            )
            .scalar()
        ) or 0

        expense = (
            db.query(
                func.sum(
                    Expense.amount
                )
            )
            .filter(
                Expense.user_id == user_id,
                extract(
                    "month",
                    Expense.expense_date
                ) == month,
                extract(
                    "year",
                    Expense.expense_date
                ) == year
            )
            .scalar()
        ) or 0

        result.append({
            "month": months[month - 1],
            "income": float(income),
            "expense": float(expense)
        })

     return result
    from sqlalchemy import func

    @staticmethod
    def get_income_expense_by_date_range(
    db,
    user_id,
    start_date,
    end_date
):

     total_income = (
        db.query(
            func.sum(Income.amount)
        )
        .filter(
            Income.user_id == user_id,
            Income.income_date >= start_date,
            Income.income_date <= end_date
        )
        .scalar()
    ) or 0

     total_expense = (
        db.query(
            func.sum(Expense.amount)
        )
        .filter(
            Expense.user_id == user_id,
            Expense.expense_date >= start_date,
            Expense.expense_date <= end_date
        )
        .scalar()
    ) or 0

     return {
        "total_income": float(total_income),
        "total_expense": float(total_expense),
        "net_balance": float(
            total_income - total_expense
        )
    }
    from sqlalchemy import func, extract


    @staticmethod
    def get_month_income(
    db,
    user_id,
    month,
    year
):

      return (
        db.query(
            func.sum(
                Income.amount
            )
        )
        .filter(
            Income.user_id == user_id,
            extract(
                "month",
                Income.income_date
            ) == month,
            extract(
                "year",
                Income.income_date
            ) == year
        )
        .scalar()
    ) or 0


    @staticmethod
    def get_month_expense(
    db,
    user_id,
    month,
    year
):

     return (
        db.query(
            func.sum(
                Expense.amount
            )
        )
        .filter(
            Expense.user_id == user_id,
            extract(
                "month",
                Expense.expense_date
            ) == month,
            extract(
                "year",
                Expense.expense_date
            ) == year
        )
        .scalar()
    ) or 0


    @staticmethod
    def get_total_savings(
    db,
    user_id
):

     return (
        db.query(
            func.sum(
                SavingsGoal.current_amount
            )
        )
        .filter(
            SavingsGoal.user_id == user_id
        )
        .scalar()
    ) or 0
    @staticmethod
    def get_budget_advisor_data(
    db,
    user_id
):

     income = (
        db.query(
            func.sum(
                Income.amount
            )
        )
        .filter(
            Income.user_id == user_id
        )
        .scalar()
        or 0
    )

     expense = (
        db.query(
            func.sum(
                Expense.amount
            )
        )
        .filter(
            Expense.user_id == user_id
        )
        .scalar()
        or 0
    )

     budget = (
        db.query(
            func.sum(
                Budget.budget_amount
            )
        )
        .filter(
            Budget.user_id == user_id
        )
        .scalar()
        or 0
    )

     savings = (
        db.query(
            func.sum(
                SavingsGoal.current_amount
            )
        )
        .filter(
            SavingsGoal.user_id == user_id
        )
        .scalar()
        or 0
    )

     return {
        "income": float(income),
        "expense": float(expense),
        "budget": float(budget),
        "savings": float(savings)
    }
    @staticmethod
    def get_highest_spending_category(
    db,
    user_id
):

     return (
        db.query(
            Category.category_name,
            func.sum(
                Expense.amount
            ).label(
                "total_amount"
            )
        )
        .join(
            Category,
            Expense.category_id ==
            Category.category_id
        )
        .filter(
            Expense.user_id ==
            user_id
        )
        .group_by(
            Category.category_name
        )
        .order_by(
            func.sum(
                Expense.amount
            ).desc()
        )
        .first()
    )


    @staticmethod
    def get_total_income(
    db,
    user_id
):

     result = (
        db.query(
            func.sum(
                Income.amount
            )
        )
        .filter(
            Income.user_id ==
            user_id
        )
        .scalar()
    )

     return result or 0


    @staticmethod
    def get_total_expense(
    db,
    user_id
):

     result = (
        db.query(
            func.sum(
                Expense.amount
            )
        )
        .filter(
            Expense.user_id ==
            user_id
        )
        .scalar()
    )

     return result or 0
    @staticmethod
    def get_savings_goal_data(
    db,
    user_id
):

     goal = (
        db.query(
            SavingsGoal
        )
        .filter(
            SavingsGoal.user_id == user_id
        )
        .first()
    )

     return goal
    