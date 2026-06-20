from datetime import date

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.recurring_transaction import (
    RecurringTransaction
)

from app.repositories.recurring_repository import (
    RecurringRepository
)

from app.repositories.user_repository import (
    UserRepository
)

from app.repositories.category_repository import (
    CategoryRepository
)


class RecurringService:

    @staticmethod
    def create_recurring(
        db: Session,
        request
    ):

        user = UserRepository.get_by_id(
            db,
            request.user_id
        )

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        category = CategoryRepository.get_by_id(
            db,
            request.category_id
        )

        if not category:
            raise HTTPException(
                status_code=404,
                detail="Category not found"
            )
        if (
       request.transaction_type == "INCOME"
        and category.category_type != "INCOME"
):
         raise HTTPException(
        status_code=400,
        detail="Income transaction requires income category"
    )

        if (
    request.transaction_type == "EXPENSE"
    and category.category_type != "EXPENSE"
):
         raise HTTPException(
        status_code=400,
        detail="Expense transaction requires expense category"
    )


        if request.amount <= 0:
            raise HTTPException(
                status_code=400,
                detail="Amount must be greater than zero"
            )

        if request.transaction_type not in [
            "INCOME",
            "EXPENSE"
        ]:
            raise HTTPException(
                status_code=400,
                detail="Transaction type must be INCOME or EXPENSE"
            )

        if request.frequency not in [
            "DAILY",
            "WEEKLY",
            "MONTHLY",
            "YEARLY"
        ]:
            raise HTTPException(
                status_code=400,
                detail="Invalid frequency"
            )

        if request.next_run_date < date.today():
            raise HTTPException(
                status_code=400,
                detail="Next run date cannot be in the past"
            )

        recurring = RecurringTransaction(

            recurring_id=
            RecurringRepository.get_next_id(
                db
            ),

            user_id=
            request.user_id,

            transaction_type=
            request.transaction_type,

            category_id=
            request.category_id,

            amount=
            request.amount,

            frequency=
            request.frequency,

            next_run_date=
            request.next_run_date
        )

        return RecurringRepository.create(
            db,
            recurring
        )

    @staticmethod
    def get_all_recurring(
        db: Session
    ):

        return RecurringRepository.get_all(
            db
        )

    @staticmethod
    def update_recurring(
        db: Session,
        recurring_id: int,
        request
    ):

        recurring = (
            RecurringRepository.get_by_id(
                db,
                recurring_id
            )
        )

        if not recurring:
            raise HTTPException(
                status_code=404,
                detail="Recurring transaction not found"
            )

        if request.amount <= 0:
            raise HTTPException(
                status_code=400,
                detail="Amount must be greater than zero"
            )

        recurring.transaction_type = (
            request.transaction_type
        )

        recurring.category_id = (
            request.category_id
        )

        recurring.amount = (
            request.amount
        )

        recurring.frequency = (
            request.frequency
        )

        recurring.next_run_date = (
            request.next_run_date
        )

        return RecurringRepository.update(
            db,
            recurring
        )

    @staticmethod
    def delete_recurring(
        db: Session,
        recurring_id: int
    ):

        recurring = (
            RecurringRepository.get_by_id(
                db,
                recurring_id
            )
        )

        if not recurring:
            raise HTTPException(
                status_code=404,
                detail="Recurring transaction not found"
            )

        RecurringRepository.delete(
            db,
            recurring
        )

        return {
            "message":
            "Recurring transaction deleted successfully"
        }


recurring_service = RecurringService()