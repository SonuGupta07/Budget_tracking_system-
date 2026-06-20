# Auto-generated placeholder: app/api/notification/notification_router.py
from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.finance.notification_schema import (
    NotificationCreate
)

from app.services.notification_service import (
    notification_service
)
router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)
@router.post("/")
def create_notification(
    request: NotificationCreate,
    db: Session = Depends(get_db)
):

    return (
        notification_service
        .create_notification(
            db,
            request
        )
    )
@router.get("/{user_id}")
def get_notifications(
    user_id: int,
    db: Session = Depends(get_db)
):

    return (
        notification_service
        .get_notifications_by_user(
            db,
            user_id
        )
    )
@router.put("/read/{notification_id}")
def mark_as_read(
    notification_id: int,
    db: Session = Depends(get_db)
):

    return (
        notification_service
        .mark_as_read(
            db,
            notification_id
        )
    )
@router.delete("/{notification_id}")
def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db)
):

    return (
        notification_service
        .delete_notification(
            db,
            notification_id
        )
    )