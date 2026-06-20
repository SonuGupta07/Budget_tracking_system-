# Auto-generated placeholder: app/models/recurring_transaction.py
# app/models/recurring_transaction.py

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Numeric
from sqlalchemy import String
from sqlalchemy import Date

from app.core.database import Base


class RecurringTransaction(Base):

    __tablename__ = "RECURRING_TRANSACTIONS"

    recurring_id = Column(
        "RECURRING_ID",
        Integer,
        primary_key=True
    )

    user_id = Column(
        "USER_ID",
        Integer,
        nullable=False
    )

    transaction_type = Column(
        "TRANSACTION_TYPE",
        String(20),
        nullable=False
    )

    category_id = Column(
        "CATEGORY_ID",
        Integer,
        nullable=False
    )

    amount = Column(
        "AMOUNT",
        Numeric(12, 2),
        nullable=False
    )

    frequency = Column(
        "FREQUENCY",
        String(20),
        nullable=False
    )

    next_run_date = Column(
        "NEXT_RUN_DATE",
        Date,
        nullable=False
    )