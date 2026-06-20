# Auto-generated placeholder: app/models/savings_goal.py
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Numeric
from sqlalchemy import Date

from app.core.database import Base


class SavingsGoal(Base):

    __tablename__ = "SAVINGS_GOALS"

    goal_id = Column(
        "GOAL_ID",
        Integer,
        primary_key=True
    )

    user_id = Column(
        "USER_ID",
        Integer
    )

    goal_name = Column(
        "GOAL_NAME",
        String(200)
    )

    target_amount = Column(
        "TARGET_AMOUNT",
        Numeric(12, 2)
    )

    current_amount = Column(
        "CURRENT_AMOUNT",
        Numeric(12, 2)
    )

    target_date = Column(
        "TARGET_DATE",
        Date
    )

    status = Column(
        "STATUS",
        String(20)
    )