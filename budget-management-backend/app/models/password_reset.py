# Auto-generated placeholder: app/models/password_reset.py
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime

from app.core.database import Base


class PasswordResetToken(Base):

    __tablename__ = "PASSWORD_RESET_TOKENS"

    token_id = Column(
        "TOKEN_ID",
        Integer,
        primary_key=True
    )

    user_id = Column(
        "USER_ID",
        Integer
    )

    token = Column(
        "TOKEN",
        String(500)
    )

    expires_at = Column(
        "EXPIRES_AT",
        DateTime
    )

    used_flag = Column(
        "USED_FLAG",
        String(1)
    )