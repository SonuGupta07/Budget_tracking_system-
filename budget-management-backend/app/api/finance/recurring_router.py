from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.finance.recurring_schema import (
    RecurringCreate,
    UpdateRecurringRequest
)

from app.services.recurring_service import (
    recurring_service
)
from app.core.dependencies import (
    get_current_user
)


router = APIRouter(
    prefix="/recurring",
    tags=["Recurring Transactions"],
    dependencies=[
        Depends(get_current_user)
    ]

)


@router.post("/")
def create_recurring(
    request: RecurringCreate,
    db: Session = Depends(get_db)
):

    return (
        recurring_service.create_recurring(
            db,
            request
        )
    )


@router.get("/")
def get_recurring(
    db: Session = Depends(get_db)
):

    return (
        recurring_service.get_all_recurring(
            db
        )
    )


@router.put("/{recurring_id}")
def update_recurring(
    recurring_id: int,
    request: UpdateRecurringRequest,
    db: Session = Depends(get_db)
):

    return (
        recurring_service.update_recurring(
            db,
            recurring_id,
            request
        )
    )


@router.delete("/{recurring_id}")
def delete_recurring(
    recurring_id: int,
    db: Session = Depends(get_db)
):

    return (
        recurring_service.delete_recurring(
            db,
            recurring_id
        )
    )