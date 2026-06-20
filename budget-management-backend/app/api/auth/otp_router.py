# Auto-generated placeholder: app/api/auth/otp_router.py
from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.auth.otp_schema import VerifyOTPRequest
from app.services.otp_service import OTPService

from app.schemas.auth.otp_schema import (
    SendOTPRequest
)

from app.services.otp_service import (
    otp_service
)

router = APIRouter(
    prefix="/auth",
    tags=["OTP"]
)


@router.post(
    "/send-otp"
)
def send_otp(
    request: SendOTPRequest,
    db: Session = Depends(get_db)
):

    return otp_service.send_otp(
        db,
        request.email
    )
@router.post("/verify-otp")
def verify_otp(
    request: VerifyOTPRequest,
    db: Session = Depends(get_db)
):

    return OTPService.verify_otp(
        db,
        request.user_id,
        request.otp_code
    )