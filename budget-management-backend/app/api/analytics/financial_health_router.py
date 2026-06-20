from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.services.financial_health_service import (
    financial_health_service
)
from app.core.dependencies import (
    get_current_user
)



router = APIRouter(
    prefix="/financial-health",
    tags=["Financial Health"],
    dependencies=[
        Depends(get_current_user)
    ]

)


@router.get(
    "/{user_id}"
)
def generate_financial_health(
    user_id: int,
    db: Session = Depends(get_db)
):

    return (
        financial_health_service.generate_score(
            db,
            user_id
        )
    )