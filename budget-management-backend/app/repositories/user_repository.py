from datetime import datetime

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.user import User


class UserRepository:

    @staticmethod
    def get_by_email(
        db: Session,
        email: str
    ):
        return (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

    @staticmethod
    def get_next_user_id(
        db: Session
    ):
        result = db.execute(
            text(
                "SELECT USERS_SEQ.NEXTVAL FROM DUAL"
            )
        )

        return result.scalar()

    @staticmethod
    def create_user(
        db: Session,
        user: User
    ):
        db.add(user)

        db.commit()

        db.refresh(user)

        return user

    @staticmethod
    def get_by_id(
        db: Session,
        user_id: int
    ):
        return (
            db.query(User)
            .filter(User.user_id == user_id)
            .first()
        )

    @staticmethod
    def verify_otp(
        db: Session,
        otp
    ):
        otp.verified_at = datetime.now()

        db.commit()

        db.refresh(otp)

        return otp

    @staticmethod
    def verify_email(
        db: Session,
        user_id: int
    ):
        user = (
            db.query(User)
            .filter(User.user_id == user_id)
            .first()
        )

        if user:
            user.is_email_verified = "Y"

            db.commit()

            db.refresh(user)

        return user

    @staticmethod
    def update_password(
        db: Session,
        user,
        password_hash: str
    ):
        user.password_hash = password_hash

        db.commit()

        db.refresh(user)

        return user