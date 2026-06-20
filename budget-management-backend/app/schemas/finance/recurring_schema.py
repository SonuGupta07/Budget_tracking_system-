# app/schemas/finance/recurring_schema.py

from datetime import date

from pydantic import BaseModel


class RecurringCreate(
    BaseModel
):
    user_id: int
    transaction_type: str
    category_id: int
    amount: float
    frequency: str
    next_run_date: date


class UpdateRecurringRequest(
    BaseModel
):
    transaction_type: str
    category_id: int
    amount: float
    frequency: str
    next_run_date: date