    # Auto-generated placeholder: app/schemas/finance/budget_schema.py
from pydantic import BaseModel


class BudgetCreate(
        BaseModel
    ):
        user_id: int
        category_id: int
        month: int
        year: int
        budget_amount: float


class UpdateBudgetRequest(
        BaseModel
    ):
        category_id: int
        month: int
        year: int
        budget_amount: float