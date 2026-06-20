from datetime import datetime
from datetime import timedelta
from uuid import uuid4

from fastapi import HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.password_reset import PasswordResetToken

from app.repositories.password_reset_repository import (
    PasswordResetRepository
)

from app.repositories.user_repository import (
    UserRepository
)

from app.utils.password_hash import (
    hash_password
)

from app.services.email_service import (
    email_service
)


class PasswordService:

    @staticmethod
    def forgot_password(
        db: Session,
        email: str
    ):

        user = UserRepository.get_by_email(
            db,
            email
        )

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        result = db.execute(
            text(
                "SELECT PASSWORD_RESET_SEQ.NEXTVAL FROM DUAL"
            )
        )

        token_id = result.scalar()

        reset_token = str(
            uuid4()
        )

        token_record = PasswordResetToken(

            token_id=token_id,

            user_id=user.user_id,

            token=reset_token,

            expires_at=
            datetime.now()
            + timedelta(minutes=15),

            used_flag="N"
        )

        PasswordResetRepository.create(
            db,
            token_record
        )

        email_service.send_email(
            user.email,
            "Password Reset",
            f"Your password reset token is:\n\n{reset_token}\n\nValid for 15 minutes."
        )

        return {
            "message":
            "Password reset email sent"
        }

    @staticmethod
    def reset_password(
        db: Session,
        token: str,
        new_password: str
    ):

        token_record = (
            PasswordResetRepository
            .get_by_token(
                db,
                token
            )
        )

        if not token_record:
            raise HTTPException(
                status_code=400,
                detail="Invalid token"
            )

        if token_record.used_flag == "Y":
            raise HTTPException(
                status_code=400,
                detail="Token already used"
            )

        if token_record.expires_at < datetime.now():
            raise HTTPException(
                status_code=400,
                detail="Token expired"
            )

        user = (
            UserRepository.get_by_id(
                db,
                token_record.user_id
            )
        )

        UserRepository.update_password(
            db,
            user,
            hash_password(
                new_password
            )
        )

        token_record.used_flag = "Y"

        db.commit()

        return {
            "message":
            "Password reset successful"
        }


password_service = PasswordService()