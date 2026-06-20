# Auto-generated placeholder: app/schemas/ai/ai_schema.py
from pydantic import BaseModel


class ExpenseCategorizationRequest(
    BaseModel
):
    expense_id: int
    description: str


class ExpenseCategorizationResponse(
    BaseModel
):
    expense_id: int
    category: str
    confidence: float

class BudgetAdvisorRequest(
    BaseModel
):
    user_id: int


class BudgetAdvisorResponse(
    BaseModel
):
    user_id: int
    recommendation: str

from pydantic import BaseModel


class ChatRequest(BaseModel):

    user_id: int

    question: str


class ChatResponse(BaseModel):

    user_id: int

    question: str

    answer: str