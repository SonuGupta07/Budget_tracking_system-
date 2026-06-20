# Auto-generated placeholder: app/core/dependencies.py
from fastapi import Depends
from fastapi import HTTPException

from fastapi.security import (
    OAuth2PasswordBearer
)

from sqlalchemy.orm import Session

from app.core.database import get_db

from app.core.jwt_handler import (
    verify_token
)

from app.repositories.user_repository import (
    UserRepository
)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


def get_current_user(

    token: str = Depends(
        oauth2_scheme
    ),

    db: Session = Depends(
        get_db
    )
):

    payload = verify_token(
        token
    )

    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user_id = payload.get(
        "user_id"
    )

    user = (
        UserRepository.get_by_id(
            db,
            user_id
        )
    )

    if not user:

        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user