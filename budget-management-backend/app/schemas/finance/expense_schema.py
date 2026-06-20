# Auto-generated placeholder: app/schemas/finance/expense_schema.py
from datetime import date

from pydantic import BaseModel


class ExpenseCreate(
    BaseModel
):
    user_id: int
    category_id: int
    amount: float
    description: str
    expense_date: date


class UpdateExpenseRequest(
    BaseModel
):
    category_id: int
    amount: float
    description: str
    expense_date: date