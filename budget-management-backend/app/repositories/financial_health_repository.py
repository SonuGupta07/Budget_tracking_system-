from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.financial_health import (
    FinancialHealthScore
)


class FinancialHealthRepository:

    @staticmethod
    def get_next_id(
        db: Session
    ):

        result = db.execute(
            text(
                """
                SELECT
                FINANCIAL_HEALTH_SEQ.NEXTVAL
                FROM DUAL
                """
            )
        )

        return result.scalar()

    @staticmethod
    def create(
        db: Session,
        score
    ):

        db.add(score)

        db.commit()

        db.refresh(score)

        return score

    @staticmethod
    def get_by_user(
        db: Session,
        user_id: int
    ):

        return (
            db.query(
                FinancialHealthScore
            )
            .filter(
                FinancialHealthScore.user_id
                == user_id
            )
            .order_by(
                FinancialHealthScore.score_id.desc()
            )
            .first()
        )