from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.budget import Budget

from app.repositories.budget_repository import BudgetRepository
from app.repositories.user_repository import UserRepository
from app.repositories.category_repository import CategoryRepository
from app.repositories.expense_repository import ExpenseRepository


class BudgetService:

    @staticmethod
    def create_budget(db: Session, request):
        user = UserRepository.get_by_id(db, request.user_id)

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        category = CategoryRepository.get_by_id(db, request.category_id)

        if not category:
            raise HTTPException(
                status_code=404,
                detail="Category not found"
            )

        if category.category_type != "EXPENSE":
            raise HTTPException(
                status_code=400,
                detail="Budget can only be created for expense categories"
            )

        if request.month < 1 or request.month > 12:
            raise HTTPException(
                status_code=400,
                detail="Month must be between 1 and 12"
            )

        if request.year < 2024:
            raise HTTPException(
                status_code=400,
                detail="Invalid year"
            )

        if request.budget_amount <= 0:
            raise HTTPException(
                status_code=400,
                detail="Budget amount must be greater than zero"
            )

        existing_budget = BudgetRepository.get_existing_budget(
            db,
            request.user_id,
            request.category_id,
            request.month,
            request.year
        )

        if existing_budget:
            raise HTTPException(
                status_code=400,
                detail="Budget already exists for this category and month"
            )

        budget = Budget(
            budget_id=BudgetRepository.get_next_id(db),
            user_id=request.user_id,
            category_id=request.category_id,
            month=request.month,
            year=request.year,
            budget_amount=request.budget_amount
        )

        return BudgetRepository.create(db, budget)

    @staticmethod
    def get_all_budget(db: Session):
        return BudgetRepository.get_all(db)

    @staticmethod
    def update_budget(db: Session, budget_id: int, request):
        budget = BudgetRepository.get_by_id(db, budget_id)

        if not budget:
            raise HTTPException(
                status_code=404,
                detail="Budget not found"
            )

        category = CategoryRepository.get_by_id(db, request.category_id)

        if not category:
            raise HTTPException(
                status_code=404,
                detail="Category not found"
            )

        if category.category_type != "EXPENSE":
            raise HTTPException(
                status_code=400,
                detail="Budget can only be created for expense categories"
            )

        if request.month < 1 or request.month > 12:
            raise HTTPException(
                status_code=400,
                detail="Month must be between 1 and 12"
            )

        if request.year < 2024:
            raise HTTPException(
                status_code=400,
                detail="Invalid year"
            )

        if request.budget_amount <= 0:
            raise HTTPException(
                status_code=400,
                detail="Budget amount must be greater than zero"
            )

        existing_budget = BudgetRepository.get_existing_budget(
            db,
            budget.user_id,
            request.category_id,
            request.month,
            request.year
        )

        if existing_budget and existing_budget.budget_id != budget_id:
            raise HTTPException(
                status_code=400,
                detail="Budget already exists for this category and month"
            )

        budget.category_id = request.category_id
        budget.month = request.month
        budget.year = request.year
        budget.budget_amount = request.budget_amount

        return BudgetRepository.update(db, budget)

    @staticmethod
    def delete_budget(db: Session, budget_id: int):
        budget = BudgetRepository.get_by_id(db, budget_id)

        if not budget:
            raise HTTPException(
                status_code=404,
                detail="Budget not found"
            )

        BudgetRepository.delete(db, budget)

        return {
            "message": "Budget deleted successfully"
        }

    @staticmethod
    def get_budget_summary(db: Session, user_id: int):
        user = UserRepository.get_by_id(db, user_id)

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        total_budget = BudgetRepository.get_total_budget_by_user(
            db,
            user_id
        )

        total_expense = ExpenseRepository.get_total_expense_by_user(
            db,
            user_id
        )

        remaining_budget = total_budget - total_expense

        utilization = 0

        if total_budget > 0:
            utilization = round(
                (total_expense / total_budget) * 100,
                2
            )

        return {
            "user_id": user_id,
            "total_budget": float(total_budget),
            "total_expense": float(total_expense),
            "remaining_budget": float(remaining_budget),
            "utilization_percentage": utilization
        }

    @staticmethod
    def get_category_summary(db: Session, user_id: int):
        user = UserRepository.get_by_id(db, user_id)

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        budgets = BudgetRepository.get_budgets_by_user(
            db,
            user_id
        )

        response = []

        for budget in budgets:
            category = CategoryRepository.get_by_id(
                db,
                budget.category_id
            )

            if not category:
                continue

            expense_amount = ExpenseRepository.get_expense_by_user_and_category(
                db,
                user_id,
                budget.category_id
            )

            remaining_amount = budget.budget_amount - expense_amount

            utilization_percentage = 0

            if budget.budget_amount > 0:
                utilization_percentage = round(
                    (expense_amount / budget.budget_amount) * 100,
                    2
                )

            response.append({
                "category_id": budget.category_id,
                "category_name": category.category_name,
                "month": budget.month,
                "year": budget.year,
                "budget": float(budget.budget_amount),
                "expense": float(expense_amount),
                "remaining": float(remaining_amount),
                "utilization_percentage": utilization_percentage
            })

        return response


budget_service = BudgetService()