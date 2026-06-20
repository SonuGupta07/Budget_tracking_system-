# Auto-generated placeholder: app/models/ai_expense_category.py
from sqlalchemy import (
    Column,
    Integer,
    String,
    Numeric,
    DateTime
)

from datetime import datetime

from app.core.database import Base


class AIExpenseCategorization(Base):

    __tablename__ = "AI_EXPENSE_CATEGORIZATION"

    ai_id = Column(
        Integer,
        primary_key=True
    )

    expense_id = Column(
        Integer
    )

    predicted_category = Column(
        String(100)
    )

    confidence_score = Column(
        Numeric(5, 2)
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )