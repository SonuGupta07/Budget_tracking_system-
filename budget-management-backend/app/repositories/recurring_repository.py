from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.recurring_transaction import (
    RecurringTransaction
)


class RecurringRepository:

    @staticmethod
    def get_next_id(
        db: Session
    ):

        result = db.execute(
            text(
                "SELECT RECURRING_TRANSACTION_SEQ.NEXTVAL FROM DUAL"
            )
        )

        return result.scalar()

    @staticmethod
    def create(
        db: Session,
        recurring
    ):

        db.add(recurring)

        db.commit()

        db.refresh(recurring)

        return recurring

    @staticmethod
    def get_all(
        db: Session
    ):

        return (
            db.query(
                RecurringTransaction
            )
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        recurring_id: int
    ):

        return (
            db.query(
                RecurringTransaction
            )
            .filter(
                RecurringTransaction.recurring_id
                == recurring_id
            )
            .first()
        )

    @staticmethod
    def update(
        db: Session,
        recurring
    ):

        db.commit()

        db.refresh(recurring)

        return recurring

    @staticmethod
    def delete(
        db: Session,
        recurring
    ):

        db.delete(recurring)

        db.commit()