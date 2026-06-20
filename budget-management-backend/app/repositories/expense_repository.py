# Auto-generated placeholder: app/repositories/expense_repository.py
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.expense import Expense
from sqlalchemy import func

class ExpenseRepository:

    @staticmethod
    def get_next_id(
        db: Session
    ):

        result = db.execute(
            text(
                "SELECT EXPENSE_SEQ.NEXTVAL FROM DUAL"
            )
        )

        return result.scalar()

    @staticmethod
    def create(
        db: Session,
        expense
    ):

        db.add(expense)

        db.commit()

        db.refresh(expense)

        return expense

    @staticmethod
    def get_all(
        db: Session
    ):

        return (
            db.query(Expense)
            .all()
        )
    @staticmethod
    def get_by_id(
    db: Session,
    expense_id: int
):

     return (
        db.query(Expense)
        .filter(
            Expense.expense_id == expense_id
        )
        .first()
    )


    @staticmethod
    def update(
    db: Session,
    expense
):

     db.commit()

     db.refresh(expense)

     return expense


    @staticmethod
    def delete(
    db: Session,
    expense
):

     db.delete(expense)

     db.commit()
    @staticmethod
    def get_total_expense_by_user(
    db: Session,
    user_id: int
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
    def get_expense_by_user_and_category(
    db: Session,
    user_id: int,
    category_id: int
):

     total = (
        db.query(
            func.sum(
                Expense.amount
            )
        )
        .filter(
            Expense.user_id == user_id,
            Expense.category_id == category_id
        )
        .scalar()
    )

     return total or 0
     