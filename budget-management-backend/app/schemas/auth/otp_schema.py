# Auto-generated placeholder: app/schemas/auth/otp_schema.py
from pydantic import BaseModel


class SendOTPRequest(
    BaseModel
):
    email: str


class VerifyOTPRequest(
    BaseModel
):
    user_id: int
    otp_code: str

