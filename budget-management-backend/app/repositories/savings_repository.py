from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.savings_goal import SavingsGoal


class SavingsRepository:

    @staticmethod
    def get_next_id(
        db: Session
    ):

        result = db.execute(
            text(
                "SELECT SAVINGS_GOAL_SEQ.NEXTVAL FROM DUAL"
            )
        )

        return result.scalar()

    @staticmethod
    def create(
        db: Session,
        goal
    ):

        db.add(goal)

        db.commit()

        db.refresh(goal)

        return goal

    @staticmethod
    def get_all(
        db: Session
    ):

        return (
            db.query(SavingsGoal)
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        goal_id: int
    ):

        return (
            db.query(SavingsGoal)
            .filter(
                SavingsGoal.goal_id == goal_id
            )
            .first()
        )

    @staticmethod
    def update(
        db: Session,
        goal
    ):

        db.commit()

        db.refresh(goal)

        return goal

    @staticmethod
    def delete(
        db: Session,
        goal
    ):

        db.delete(goal)

        db.commit()