# Auto-generated placeholder: app/services/savings_service.py
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.savings_goal import SavingsGoal

from app.repositories.savings_repository import (
    SavingsRepository
)

from app.repositories.user_repository import (
    UserRepository
)


class SavingsService:

    @staticmethod
    def create_goal(
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

        if request.target_amount <= 0:
            raise HTTPException(
                status_code=400,
                detail="Target amount must be greater than zero"
            )

        if request.current_amount < 0:
            raise HTTPException(
                status_code=400,
                detail="Current amount cannot be negative"
            )

        goal = SavingsGoal(

            goal_id=
            SavingsRepository.get_next_id(
                db
            ),

            user_id=
            request.user_id,

            goal_name=
            request.goal_name,

            target_amount=
            request.target_amount,

            current_amount=
            request.current_amount,

            target_date=
            request.target_date,

            status=
            "IN_PROGRESS"
        )

        return (
            SavingsRepository.create(
                db,
                goal
            )
        )

    @staticmethod
    def get_all_goals(
        db: Session
    ):

        return (
            SavingsRepository.get_all(
                db
            )
        )
    @staticmethod
    def update_goal(
    db: Session,
    goal_id: int,
    request
):

     goal = SavingsRepository.get_by_id(
        db,
        goal_id
    )

     if not goal:
        raise HTTPException(
            status_code=404,
            detail="Savings goal not found"
        )

     if request.target_amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Target amount must be greater than zero"
        )

     if request.current_amount < 0:
        raise HTTPException(
            status_code=400,
            detail="Current amount cannot be negative"
        )

     goal.goal_name = request.goal_name
     goal.target_amount = request.target_amount
     goal.current_amount = request.current_amount
     goal.target_date = request.target_date

     if (
        request.current_amount
        >= request.target_amount
    ):
        goal.status = "COMPLETED"
     else:
        goal.status = "IN_PROGRESS"

     return (
        SavingsRepository.update(
            db,
            goal
        )
    )
    @staticmethod
    def delete_goal(
    db: Session,
    goal_id: int
):

     goal = SavingsRepository.get_by_id(
        db,
        goal_id
    )

     if not goal:
        raise HTTPException(
            status_code=404,
            detail="Savings goal not found"
        )

     SavingsRepository.delete(
        db,
        goal
    )

     return {
        "message":
        "Savings goal deleted successfully"
    }
    @staticmethod
    def get_progress(
    db: Session,
    goal_id: int
):

     goal = SavingsRepository.get_by_id(
        db,
        goal_id
    )

     if not goal:
        raise HTTPException(
            status_code=404,
            detail="Savings goal not found"
        )

     progress = round(
        (
            goal.current_amount
            /
            goal.target_amount
        ) * 100,
        2
    )

     remaining = (
        goal.target_amount
        -
        goal.current_amount
    )

     status = (
        "COMPLETED"
        if goal.current_amount
        >= goal.target_amount
        else "IN_PROGRESS"
    )

     return {
        "goal_id":
        goal.goal_id,

        "goal_name":
        goal.goal_name,

        "target_amount":
        float(goal.target_amount),

        "current_amount":
        float(goal.current_amount),

        "remaining_amount":
        float(remaining),

        "progress_percentage":
        progress,

        "status":
        status
    }
    
savings_service = SavingsService()