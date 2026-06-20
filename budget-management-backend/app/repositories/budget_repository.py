from sqlalchemy import text
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.budget import Budget
from sqlalchemy import func


class BudgetRepository:

    @staticmethod
    def get_next_id(
        db: Session
    ):

        result = db.execute(
            text(
                "SELECT BUDGET_SEQ.NEXTVAL FROM DUAL"
            )
        )

        return result.scalar()

    @staticmethod
    def create(
        db: Session,
        budget
    ):

        db.add(budget)

        db.commit()

        db.refresh(budget)

        return budget

    @staticmethod
    def get_all(
        db: Session
    ):

        return (
            db.query(Budget)
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        budget_id: int
    ):

        return (
            db.query(Budget)
            .filter(
                Budget.budget_id == budget_id
            )
            .first()
        )

    @staticmethod
    def get_existing_budget(
        db: Session,
        user_id: int,
        category_id: int,
        month: int,
        year: int
    ):

        return (
            db.query(Budget)
            .filter(
                Budget.user_id == user_id,
                Budget.category_id == category_id,
                Budget.month == month,
                Budget.year == year
            )
            .first()
        )

    @staticmethod
    def update(
        db: Session,
        budget
    ):

        db.commit()

        db.refresh(budget)

        return budget

    @staticmethod
    def delete(
        db: Session,
        budget
    ):

        db.delete(budget)

        db.commit()

    @staticmethod
    def get_total_budget_by_user(
        db: Session,
        user_id: int
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
    def get_budgets_by_user(
    db: Session,
    user_id: int
):

     return (
        db.query(Budget)
        .filter(
            Budget.user_id == user_id
        )
        .all()
    )