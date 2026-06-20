# Auto-generated placeholder: app/services/expense_service.py
from datetime import datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.expense import Expense

from app.repositories.expense_repository import (
    ExpenseRepository
)

from app.repositories.user_repository import (
    UserRepository
)

from app.repositories.category_repository import (
    CategoryRepository
)


class ExpenseService:

    @staticmethod
    def create_expense(
        db: Session,
        request
    ):

        user = UserRepository.get_by_id(
            db,
            request.user_id
        )

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        category = CategoryRepository.get_by_id(
            db,
            request.category_id
        )

        if not category:
            raise HTTPException(
                status_code=404,
                detail="Category not found"
            )

        if category.category_type != "EXPENSE":
            raise HTTPException(
                status_code=400,
                detail="Selected category is not an expense category"
            )

        if request.amount <= 0:
            raise HTTPException(
                status_code=400,
                detail="Amount must be greater than zero"
            )

        expense = Expense(
            expense_id=
            ExpenseRepository.get_next_id(
                db
            ),

            user_id=
            request.user_id,

            category_id=
            request.category_id,

            amount=
            request.amount,

            description=
            request.description,

            expense_date=
            request.expense_date,

            created_at=
            datetime.now()
        )

        return ExpenseRepository.create(
            db,
            expense
        )

    @staticmethod
    def get_all_expense(
        db: Session
    ):

        return ExpenseRepository.get_all(
            db
        )
    @staticmethod
    def update_expense(
    db: Session,
    expense_id: int,
    request
    ):

     expense = ExpenseRepository.get_by_id(
        db,
        expense_id
    )

     if not expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

     category = CategoryRepository.get_by_id(
        db,
        request.category_id
     )

     if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

     if category.category_type != "EXPENSE":
        raise HTTPException(
            status_code=400,
            detail="Selected category is not an expense category"
        )

     if request.amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Amount must be greater than zero"
        )

     expense.category_id = request.category_id
     expense.amount = request.amount
     expense.description = request.description
     expense.expense_date = request.expense_date

     return ExpenseRepository.update(
        db,
        expense
    )


    @staticmethod
    def delete_expense(
    db: Session,
    expense_id: int
    ):

     expense = ExpenseRepository.get_by_id(
        db,
        expense_id
    )

     if not expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

     ExpenseRepository.delete(
        db,
        expense
    )

     return {
        "message":
        "Expense deleted successfully"
    }


expense_service = ExpenseService()