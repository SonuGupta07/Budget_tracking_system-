from datetime import date

from pydantic import BaseModel


class SavingsCreate(
    BaseModel
):
    user_id: int
    goal_name: str
    target_amount: float
    current_amount: float
    target_date: date


class UpdateSavingsRequest(
    BaseModel
):
    goal_name: str
    target_amount: float
    current_amount: float
    target_date: date