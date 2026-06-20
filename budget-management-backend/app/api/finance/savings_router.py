from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.finance.savings_schema import (
    SavingsCreate
)

from app.services.savings_service import (
    savings_service
)
from app.schemas.finance.savings_schema import (
    UpdateSavingsRequest
)
from app.core.dependencies import (
    get_current_user
)


router = APIRouter(
    prefix="/savings",
    tags=["Savings Goals"],
        dependencies=[
        Depends(get_current_user)
    ]

)


@router.post("/")
def create_goal(
    request: SavingsCreate,
    db: Session = Depends(get_db)
):

    return (
        savings_service.create_goal(
            db,
            request
        )
    )


@router.get("/")
def get_goals(
    db: Session = Depends(get_db)
):

    return (
        savings_service.get_all_goals(
            db
        )
    )
@router.put(
    "/{goal_id}"
)
def update_goal(
    goal_id: int,
    request: UpdateSavingsRequest,
    db: Session = Depends(get_db)
):

    return (
        savings_service.update_goal(
            db,
            goal_id,
            request
        )
    )
@router.delete(
    "/{goal_id}"
)
def delete_goal(
    goal_id: int,
    db: Session = Depends(get_db)
):

    return (
        savings_service.delete_goal(
            db,
            goal_id
        )
    )
@router.get(
    "/progress/{goal_id}"
)
def get_progress(
    goal_id: int,
    db: Session = Depends(get_db)
):

    return (
        savings_service.get_progress(
            db,
            goal_id
        )
    )