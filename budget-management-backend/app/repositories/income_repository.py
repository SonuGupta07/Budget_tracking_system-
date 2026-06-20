# Auto-generated placeholder: app/repositories/income_repository.py
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.income import Income


class IncomeRepository:

    @staticmethod
    def get_next_id(
        db: Session
    ):

        result = db.execute(
            text(
                "SELECT INCOME_SEQ.NEXTVAL FROM DUAL"
            )
        )

        return result.scalar()

    @staticmethod
    def create(
        db: Session,
        income
    ):

        db.add(income)

        db.commit()

        db.refresh(income)

        return income

    @staticmethod
    def get_all(
        db: Session
    ):

        return (
            db.query(Income)
            .all()
        )
    @staticmethod
    def get_by_id(
    db,
    income_id: int
):
     return (
        db.query(Income)
        .filter(
            Income.income_id == income_id
        )
        .first()
    )


    @staticmethod
    def update(
    db,
    income
    ):

     db.commit()

     db.refresh(income)

     return income


    @staticmethod
    def delete(
    db,
    income
     ):

      db.delete(income)

      db.commit() 
    