from datetime import datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.notification import Notification

from app.repositories.notification_repository import (
    NotificationRepository
)

from app.repositories.user_repository import (
    UserRepository
)
class NotificationService:
    @staticmethod
    def create_notification(
        db: Session,
        request
    ):

        user = UserRepository.get_by_id(
            db,
            request.user_id
        )

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        if not request.title.strip():
            raise HTTPException(
                status_code=400,
                detail="Title cannot be empty"
            )

        if not request.message.strip():
            raise HTTPException(
                status_code=400,
                detail="Message cannot be empty"
            )

        notification = Notification(
            notification_id=
            NotificationRepository.get_next_id(db),

            user_id=
            request.user_id,

            title=
            request.title,

            message=
            request.message,

            is_read="N",

            created_at=
            datetime.now()
        )

        return NotificationRepository.create(
            db,
            notification
        )
    @staticmethod
    def get_notifications_by_user(
        db: Session,
        user_id: int
    ):

        user = UserRepository.get_by_id(
            db,
            user_id
        )

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        return (
            NotificationRepository
            .get_by_user(
                db,
                user_id
            )
        )
    @staticmethod
    def mark_as_read(
        db: Session,
        notification_id: int
    ):

        notification = (
            NotificationRepository
            .get_by_id(
                db,
                notification_id
            )
        )

        if not notification:
            raise HTTPException(
                status_code=404,
                detail="Notification not found"
            )

        notification.is_read = "Y"

        return (
            NotificationRepository
            .update(
                db,
                notification
            )
        )
    @staticmethod
    def delete_notification(
        db: Session,
        notification_id: int
    ):

        notification = (
            NotificationRepository
            .get_by_id(
                db,
                notification_id
            )
        )

        if not notification:
            raise HTTPException(
                status_code=404,
                detail="Notification not found"
            )

        NotificationRepository.delete(
            db,
            notification
        )

        return {
            "message":
            "Notification deleted successfully"
        }
notification_service = NotificationService()