from sqlalchemy.orm import Session

from app.models.password_reset import (
    PasswordResetToken
)


class PasswordResetRepository:

    @staticmethod
    def create(
        db: Session,
        reset_token
    ):
        db.add(reset_token)

        db.commit()

        db.refresh(reset_token)

        return reset_token

    @staticmethod
    def get_by_token(
        db: Session,
        token: str
    ):
        return (
            db.query(
                PasswordResetToken
            )
            .filter(
                PasswordResetToken.token
                == token
            )
            .first()
        )