# Auto-generated placeholder: app/models/budget.py
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Numeric

from app.core.database import Base


class Budget(Base):

    __tablename__ = "BUDGETS"

    budget_id = Column(
        "BUDGET_ID",
        Integer,
        primary_key=True
    )

    user_id = Column(
        "USER_ID",
        Integer
    )

    category_id = Column(
        "CATEGORY_ID",
        Integer
    )

    month = Column(
        "MONTH",
        Integer
    )

    year = Column(
        "YEAR",
        Integer
    )

    budget_amount = Column(
        "BUDGET_AMOUNT",
        Numeric(12, 2)
    )