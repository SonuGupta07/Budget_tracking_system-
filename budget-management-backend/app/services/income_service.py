from datetime import datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.income import Income

from app.repositories.income_repository import (
    IncomeRepository
)

from app.repositories.user_repository import (
    UserRepository
)

from app.repositories.category_repository import (
    CategoryRepository
)


class IncomeService:

    @staticmethod
    def create_income(
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

        if category.category_type != "INCOME":
            raise HTTPException(
                status_code=400,
                detail="Selected category is not an income category"
            )

        if request.amount <= 0:
            raise HTTPException(
                status_code=400,
                detail="Amount must be greater than zero"
            )

        income = Income(
            income_id=IncomeRepository.get_next_id(db),
            user_id=request.user_id,
            category_id=request.category_id,
            amount=request.amount,
            description=request.description,
            income_date=request.income_date,
            created_at=datetime.now()
        )

        return IncomeRepository.create(
            db,
            income
        )

    @staticmethod
    def get_all_income(
        db: Session
    ):

        return IncomeRepository.get_all(
            db
        )

    @staticmethod
    def update_income(
        db: Session,
        income_id: int,
        request
    ):

        income = IncomeRepository.get_by_id(
            db,
            income_id
        )

        if not income:
            raise HTTPException(
                status_code=404,
                detail="Income not found"
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

        if category.category_type != "INCOME":
            raise HTTPException(
                status_code=400,
                detail="Selected category is not an income category"
            )

        if request.amount <= 0:
            raise HTTPException(
                status_code=400,
                detail="Amount must be greater than zero"
            )

        income.category_id = request.category_id
        income.amount = request.amount
        income.description = request.description
        income.income_date = request.income_date

        return IncomeRepository.update(
            db,
            income
        )

    @staticmethod
    def delete_income(
        db: Session,
        income_id: int
    ):

        income = IncomeRepository.get_by_id(
            db,
            income_id
        )

        if not income:
            raise HTTPException(
                status_code=404,
                detail="Income not found"
            )

        IncomeRepository.delete(
            db,
            income
        )

        return {
            "message": "Income deleted successfully"
        }


income_service = IncomeService()