# Auto-generated placeholder: app/api/ai/ai_router.py
from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.services.ai_service import (
    ai_service
)
from app.schemas.ai.ai_schema import (
    ChatRequest
)

from app.schemas.ai.ai_schema import (
    ExpenseCategorizationRequest
)
from app.schemas.ai.ai_schema import (
    BudgetAdvisorRequest
)
from app.core.dependencies import (
    get_current_user
)

router = APIRouter(
    prefix="/ai",
    tags=["GenAI"],
    dependencies=[
        Depends(get_current_user)
    ]

)


@router.post(
    "/categorize-expense"
)
def categorize_expense(
    request: ExpenseCategorizationRequest,
    db: Session = Depends(get_db)
):

    return ai_service.categorize_expense(
        db,
        request.expense_id,
        request.description
    )
@router.post(
    "/budget-advisor"
)
def budget_advisor(
    request: BudgetAdvisorRequest,
    db: Session = Depends(get_db)
):

    return (
        ai_service
        .budget_advisor(
            db,
            request.user_id
        )
    )
@router.get(
    "/spending-insights/{user_id}"
)
def spending_insights(
    user_id: int,
    db: Session = Depends(get_db)
):

    return (
        ai_service
        .spending_insights(
            db,
            user_id
        )
    )
@router.get(
    "/savings-recommendation/{user_id}"
)
def savings_recommendation(
    user_id: int,
    db: Session = Depends(get_db)
):

    return (
        ai_service
        .savings_recommendation(
            db,
            user_id
        )
    )
@router.post(
    "/financial-chatbot"
)
def financial_chatbot(
    request: ChatRequest,
    db: Session = Depends(get_db)
):

    return (
        ai_service
        .financial_chatbot(
            db,
            request.user_id,
            request.question
        )
    )