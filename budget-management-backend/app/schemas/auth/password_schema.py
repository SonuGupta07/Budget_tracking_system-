# Auto-generated placeholder: app/schemas/auth/password_schema.py
from pydantic import BaseModel


class ForgotPasswordRequest(
    BaseModel
):
    email: str


class ResetPasswordRequest(
    BaseModel
):
    token: str
    new_password: str