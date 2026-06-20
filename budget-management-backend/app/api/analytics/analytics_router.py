from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.services.analytics_service import (
    analytics_service
)
from app.core.dependencies import (
    get_current_user
)
router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
    dependencies=[
        Depends(get_current_user)
    ]
)
@router.get(
    "/pie-chart/{user_id}"
)
def get_expense_distribution(
    user_id: int,
    db: Session = Depends(get_db)
):

    return (
        analytics_service
        .get_expense_distribution(
            db,
            user_id
        )
    )
@router.get(
    "/bar-chart/{user_id}"
)
def get_income_expense_bar_chart(
    user_id: int,
    month: int,
    year: int,
    db: Session = Depends(get_db)
):

    return (
        analytics_service
        .income_expense_bar_chart(
            db,
            user_id,
            month,
            year
        )
    )
@router.get(
    "/bar-chart-year/{user_id}"
)
def get_income_expense_year_chart(
    user_id: int,
    year: int,
    db: Session = Depends(get_db)
):

    return (
        analytics_service
        .income_expense_year_chart(
            db,
            user_id,
            year
        )
    )
from datetime import date

@router.get(
    "/date-range/{user_id}"
)
def get_date_range_analytics(
    user_id: int,
    start_date: date,
    end_date: date,
    db: Session = Depends(get_db)
):

    return (
        analytics_service
        .income_expense_date_range(
            db,
            user_id,
            start_date,
            end_date
        )
    )
@router.get(
    "/trend/{user_id}"
)
def get_trend_analysis(
    user_id: int,
    db: Session = Depends(get_db)
):

    return (
        analytics_service
        .get_trend_analysis(
            db,
            user_id
        )
    )