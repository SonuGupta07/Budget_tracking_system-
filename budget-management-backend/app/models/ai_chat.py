# Auto-generated placeholder: app/models/ai_chat.py
from sqlalchemy import (
    Column,
    Integer,
    CLOB,
    TIMESTAMP
)

from app.core.database import Base


class AIChatHistory(Base):

    __tablename__ = "AI_CHAT_HISTORY"

    chat_id = Column(
        "CHAT_ID",
        Integer,
        primary_key=True
    )

    user_id = Column(
        "USER_ID",
        Integer,
        nullable=False
    )

    question = Column(
        "QUESTION",
        CLOB
    )

    response = Column(
        "RESPONSE",
        CLOB
    )

    created_at = Column(
        "CREATED_AT",
        TIMESTAMP
    )