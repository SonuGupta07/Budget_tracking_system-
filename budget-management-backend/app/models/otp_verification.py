# Auto-generated placeholder: app/models/otp_verification.py
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime

from app.core.database import Base


class OTPVerification(Base):

    __tablename__ = "OTP_VERIFICATIONS"

    otp_id = Column(
        "OTP_ID",
        Integer,
        primary_key=True
    )

    user_id = Column(
        "USER_ID",
        Integer
    )

    otp_code = Column(
        "OTP_CODE",
        String(10)
    )

    purpose = Column(
        "PURPOSE",
        String(50)
    )

    expires_at = Column(
        "EXPIRES_AT",
        DateTime
    )

    verified_at = Column(
        "VERIFIED_AT",
        DateTime
    )