# Auto-generated placeholder: app/models/financial_health.py
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import DateTime

from app.core.database import Base


class FinancialHealthScore(Base):

    __tablename__ = "FINANCIAL_HEALTH_SCORE"

    score_id = Column(
        Integer,
        primary_key=True
    )

    user_id = Column(
        Integer
    )

    score = Column(
        Integer
    )

    generated_at = Column(
        DateTime
    )