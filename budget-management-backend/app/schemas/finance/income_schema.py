# Auto-generated placeholder: app/schemas/finance/income_schema.py
from datetime import date

from pydantic import BaseModel


class IncomeCreate(
    BaseModel
):
    user_id: int
    category_id: int
    amount: float
    description: str
    income_date: date




class UpdateIncomeRequest(
    BaseModel
):
    category_id: int
    amount: float
    description: str
    income_date: date