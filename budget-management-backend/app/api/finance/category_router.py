# Auto-generated placeholder: app/api/finance/category_router.py
from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.finance.category_schema import (
    CategoryCreate
)

from app.services.category_service import (
    category_service
)
from app.core.dependencies import (
    get_current_user
)


router = APIRouter(
    prefix="/categories",
    tags=["Categories"],
    dependencies=[
        Depends(get_current_user)
    ]

)


@router.post("/")
def create_category(
    request: CategoryCreate,
    db: Session = Depends(get_db)
):

    return (
        category_service.create_category(
            db,
            request
        )
    )


@router.get("/")
def get_categories(
    db: Session = Depends(get_db)
):

    return (
        category_service.get_all_categories(
            db
        )
    )