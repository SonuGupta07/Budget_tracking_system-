# Auto-generated placeholder: app/api/analytics/analytics_router.py
from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.services.dashboard_service import (
    dashboard_service
)
from app.core.dependencies import (
    get_current_user
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard Analytics"],
    dependencies=[
        Depends(get_current_user)
    ]

)


@router.get(
    "/{user_id}"
)
def get_dashboard(
    user_id: int,
    db: Session = Depends(get_db)
):

    return (
        dashboard_service.get_dashboard(
            db,
            user_id
        )
    )