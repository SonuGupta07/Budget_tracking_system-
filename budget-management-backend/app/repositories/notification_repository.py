# Auto-generated placeholder: app/repositories/notification_repository.py
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.notification import Notification


class NotificationRepository:

    @staticmethod
    def get_next_id(db: Session):

        result = db.execute(
            text(
                "SELECT NOTIFICATION_SEQ.NEXTVAL FROM DUAL"
            )
        )

        return result.scalar()

    @staticmethod
    def create(
        db: Session,
        notification
    ):

        db.add(notification)

        db.commit()

        db.refresh(notification)

        return notification

    @staticmethod
    def get_by_id(
        db: Session,
        notification_id: int
    ):

        return (
            db.query(Notification)
            .filter(
                Notification.notification_id
                == notification_id
            )
            .first()
        )

    @staticmethod
    def get_by_user(
        db: Session,
        user_id: int
    ):

        return (
            db.query(Notification)
            .filter(
                Notification.user_id
                == user_id
            )
            .all()
        )

    @staticmethod
    def update(
        db: Session,
        notification
    ):

        db.commit()

        db.refresh(notification)

        return notification

    @staticmethod
    def delete(
        db: Session,
        notification
    ):

        db.delete(notification)

        db.commit()