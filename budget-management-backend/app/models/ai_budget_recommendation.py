# Auto-generated placeholder: app/models/ai_budget_recommendation.py
from sqlalchemy import (
    Column,
    Integer,
    DateTime,
    CLOB
)

from datetime import datetime

from app.core.database import Base


class AIBudgetRecommendation(Base):

    __tablename__ = "AI_BUDGET_RECOMMENDATIONS"

    recommendation_id = Column(
        Integer,
        primary_key=True
    )

    user_id = Column(
        Integer
    )

    recommendation_text = Column(
        CLOB
    )

    generated_at = Column(
        DateTime,
        default=datetime.utcnow
    )