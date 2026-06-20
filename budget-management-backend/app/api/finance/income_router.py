from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.finance.income_schema import (
    IncomeCreate,
    UpdateIncomeRequest
)
from app.core.dependencies import (
    get_current_user
)

from app.services.income_service import (
    income_service
)

router = APIRouter(
    prefix="/income",
    tags=["Income"],
    dependencies=[
        Depends(get_current_user)
    ]

   

)


@router.post("/")
def create_income(
    request: IncomeCreate,
    db: Session = Depends(get_db)
):

    return (
        income_service.create_income(
            db,
            request
        )
    )


@router.get("/")
def get_income(
    db: Session = Depends(get_db),
    

):

    return (
        income_service.get_all_income(
            db
        )
    )


@router.put("/{income_id}")
def update_income(
    income_id: int,
    request: UpdateIncomeRequest,
    db: Session = Depends(get_db)
):

    return (
        income_service.update_income(
            db,
            income_id,
            request
        )
    )


@router.delete("/{income_id}")
def delete_income(
    income_id: int,
    db: Session = Depends(get_db)
):

    return (
        income_service.delete_income(
            db,
            income_id
        )
    )