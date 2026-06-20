from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.otp_verification import OTPVerification
from datetime import datetime


class OTPRepository:

    @staticmethod
    def get_next_otp_id(
        db: Session
    ):

        result = db.execute(
            text(
                "SELECT OTP_SEQ.NEXTVAL FROM DUAL"
            )
        )

        return result.scalar()

    @staticmethod
    def create(
        db: Session,
        otp: OTPVerification
    ):

        db.add(otp)

        db.commit()

        db.refresh(otp)

        return otp

    @staticmethod
    def get_valid_otp(
        db: Session,
        user_id: int,
        otp_code: str
    ):

        return (
            db.query(
                OTPVerification
            )
            .filter(
                OTPVerification.user_id == user_id,
                OTPVerification.otp_code == otp_code,
                OTPVerification.verified_at == None

            )
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