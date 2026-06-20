# Auto-generated placeholder: app/models/notification.py
# app/models/notification.py

from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime

from app.core.database import Base


class Notification(Base):

    __tablename__ = "NOTIFICATIONS"

    notification_id = Column(
        Integer,
        primary_key=True
    )

    user_id = Column(
        Integer
    )

    title = Column(
        String(255)
    )

    message = Column(
        String(1000)
    )

    is_read = Column(
        String(1)
    )

    created_at = Column(
        DateTime
    )