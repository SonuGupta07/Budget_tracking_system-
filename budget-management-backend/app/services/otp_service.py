from datetime import datetime
from datetime import timedelta
from random import randint

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.otp_verification import OTPVerification

from app.repositories.user_repository import UserRepository
from app.repositories.otp_repository import OTPRepository

from app.services.email_service import email_service


class OTPService:

    @staticmethod
    def send_otp(
        db: Session,
        email: str
    ):

        user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        otp = str(
            randint(
                100000,
                999999
            )
        )

        otp_record = OTPVerification(

            otp_id=
            OTPRepository.get_next_otp_id(
                db
            ),

            user_id=
            user.user_id,

            otp_code=
            otp,

            purpose=
            "EMAIL_VERIFICATION",

            expires_at=
            datetime.now()
            + timedelta(minutes=5)
        )

        OTPRepository.create(
            db,
            otp_record
        )

        email_service.send_email(
            email,
            "Budget Management OTP",
            f"Your OTP is: {otp}"
        )

        return {
            "message":
            "OTP sent successfully"
        }

    @staticmethod
    def verify_otp(
        db: Session,
        user_id: int,
        otp_code: str
    ):

        otp = OTPRepository.get_valid_otp(
            db,
            user_id,
            otp_code
        )

        if not otp:
            raise HTTPException(
                status_code=400,
                detail="Invalid OTP"
            )

        if otp.expires_at < datetime.now():
            raise HTTPException(
                status_code=400,
                detail="OTP expired"
            )

        OTPRepository.verify_otp(
            db,
            otp
        )

        UserRepository.verify_email(
            db,
            user_id
        )

        return {
            "message":
            "OTP verified successfully"
        }


otp_service = OTPService()