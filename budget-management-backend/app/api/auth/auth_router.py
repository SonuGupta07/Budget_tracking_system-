# Auto-generated placeholder: app/api/auth/auth_router.py
from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.auth.login_schema import LoginRequest
from app.services.auth_service import AuthService


from app.schemas.auth.register_schema import (
    RegisterRequest
)

from app.services.auth_service import (
    auth_service
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):

    user = auth_service.register_user(
        db,
        request
    )

    return {

        "message":
        "User registered successfully",

        "user_id":
        user.user_id
    }

@router.post("/login")
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):
    return AuthService.login(
        db,
        request.email,
        request.password
    )