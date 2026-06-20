# Auto-generated placeholder: app/api/finance/expense_router.py
from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.finance.expense_schema import (
    ExpenseCreate,
    UpdateExpenseRequest
)
from app.core.dependencies import (
    get_current_user
)


from app.services.expense_service import (
    expense_service
)

router = APIRouter(
    prefix="/expense",
    tags=["Expense"],
    dependencies=[
        Depends(get_current_user)
    ]

)
from app.core.dependencies import (
    get_current_user
)


@router.post("/")
def create_expense(
    request: ExpenseCreate,
    db: Session = Depends(get_db),
    
):

    return (
        expense_service.create_expense(
            db,
            request
        )
    )


@router.get("/")
def get_expense(
    db: Session = Depends(get_db)
):

    return (
        expense_service.get_all_expense(
            db
        )
    )
@router.put("/{expense_id}")
def update_expense(
    expense_id: int,
    request: UpdateExpenseRequest,
    db: Session = Depends(get_db)
):

    return (
        expense_service.update_expense(
            db,
            expense_id,
            request
        )
    )


@router.delete("/{expense_id}")
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db)
):

    return (
        expense_service.delete_expense(
            db,
            expense_id
        )
    )