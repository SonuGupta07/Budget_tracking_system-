# Auto-generated placeholder: app/api/auth/password_router.py
from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.auth.password_schema import (
    ForgotPasswordRequest,
    ResetPasswordRequest
)

from app.services.password_service import (
    password_service
)

router = APIRouter(
    prefix="/auth",
    tags=["Password"]
)


@router.post(
    "/forgot-password"
)
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):

    return (
        password_service
        .forgot_password(
            db,
            request.email
        )
    )


@router.post(
    "/reset-password"
)
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):

    return (
        password_service
        .reset_password(
            db,
            request.token,
            request.new_password
        )
    )