# Auto-generated placeholder: app/models/income.py
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Numeric
from sqlalchemy import String
from sqlalchemy import Date
from sqlalchemy import TIMESTAMP

from app.core.database import Base


class Income(Base):

    __tablename__ = "INCOME"

    income_id = Column(
        "INCOME_ID",
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

    income_date = Column(
        "INCOME_DATE",
        Date
    )

    created_at = Column(
        "CREATED_AT",
        TIMESTAMP
    )