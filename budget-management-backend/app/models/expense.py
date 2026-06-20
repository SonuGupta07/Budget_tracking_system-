# Auto-generated placeholder: app/models/expense.py
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Numeric
from sqlalchemy import String
from sqlalchemy import Date
from sqlalchemy import TIMESTAMP

from app.core.database import Base


class Expense(Base):

    __tablename__ = "EXPENSES"

    expense_id = Column(
        "EXPENSE_ID",
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

    amount = Column(
        "AMOUNT",
        Numeric(12, 2)
    )

    description = Column(
        "DESCRIPTION",
        String(500)
    )

    expense_date = Column(
        "EXPENSE_DATE",
        Date
    )

    created_at = Column(
        "CREATED_AT",
        TIMESTAMP
    )