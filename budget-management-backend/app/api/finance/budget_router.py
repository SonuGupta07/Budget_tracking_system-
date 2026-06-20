# Auto-generated placeholder: app/api/finance/budget_router.py
from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.finance.budget_schema import (
    BudgetCreate,
    UpdateBudgetRequest
)
from app.core.dependencies import (
    get_current_user
)


from app.services.budget_service import (
    budget_service
)

router = APIRouter(
    prefix="/budget",
    tags=["Budget"],
    dependencies=[
        Depends(get_current_user)
    ]
)


@router.post("/")
def create_budget(
    request: BudgetCreate,
    db: Session = Depends(get_db)
):

    return (
        budget_service.create_budget(
            db,
            request
        )
    )


@router.get("/")
def get_budget(
    db: Session = Depends(get_db)
):

    return (
        budget_service.get_all_budget(
            db
        )
    )
@router.put("/{budget_id}")
def update_budget(
    budget_id: int,
    request: UpdateBudgetRequest,
    db: Session = Depends(get_db)
):

    return (
        budget_service.update_budget(
            db,
            budget_id,
            request
        )
    )
@router.delete("/{budget_id}")
def delete_budget(
    budget_id: int,
    db: Session = Depends(get_db)
):

    return (
        budget_service.delete_budget(
            db,
            budget_id
        )
    )
@router.get(
    "/summary/{user_id}"
)
def get_budget_summary(
    user_id: int,
    db: Session = Depends(get_db)
):

    return (
        budget_service
        .get_budget_summary(
            db,
            user_id
        )
    )
@router.get(
    "/category-summary/{user_id}"
)
def get_category_summary(
    user_id: int,
    db: Session = Depends(get_db)
):

    return (
        budget_service
        .get_category_summary(
            db,
            user_id
        )
    )