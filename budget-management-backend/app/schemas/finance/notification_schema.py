# app/schemas/notification_schema.py

from pydantic import BaseModel


class NotificationCreate(BaseModel):

    user_id: int

    title: str

    message: str


class NotificationResponse(BaseModel):

    notification_id: int

    user_id: int

    title: str

    message: str

    is_read: str

    class Config:
        from_attributes = True