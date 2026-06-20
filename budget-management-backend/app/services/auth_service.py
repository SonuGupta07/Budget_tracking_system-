from datetime import datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.user_role import UserRole

from app.repositories.user_repository import UserRepository
from app.repositories.role_repository import RoleRepository
from app.repositories.user_role_repository import UserRoleRepository

from app.utils.password_hash import (
    hash_password,
    verify_password
)

from app.core.jwt_handler import (
    create_access_token
)


class AuthService:

    @staticmethod
    def register_user(
        db: Session,
        request
    ):

        existing_user = (
            UserRepository.get_by_email(
                db,
                request.email
            )
        )

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already exists"
            )

        user_id = (
            UserRepository.get_next_user_id(
                db
            )
        )

        user = User(

            user_id=user_id,

            first_name=request.first_name,

            last_name=request.last_name,

            email=request.email,

            phone=request.phone,

            password_hash=hash_password(
                request.password
            ),

            is_email_verified="N",

            is_phone_verified="N",

            status="ACTIVE",

            created_at=datetime.now(),

            updated_at=datetime.now()
        )

        created_user = (
            UserRepository.create_user(
                db,
                user
            )
        )

        role = (
            RoleRepository.get_user_role(
                db
            )
        )

        if role:

            user_role = UserRole(

                user_role_id=
                UserRoleRepository.get_next_id(
                    db
                ),

                user_id=
                created_user.user_id,

                role_id=
                role.role_id
            )

            UserRoleRepository.create(
                db,
                user_role
            )

        return created_user

    @staticmethod
    def login(
        db: Session,
        email: str,
        password: str
    ):

        user = (
            UserRepository.get_by_email(
                db,
                email
            )
        )

        if not user:
            raise HTTPException(
                status_code=401,
                detail="Invalid credentials"
            )

        if not verify_password(
            password,
            user.password_hash
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid credentials"
            )

        token = (
            create_access_token(
                {
                    "user_id":
                    user.user_id,

                    "email":
                    user.email
                }
            )
        )

        return {
            "access_token": token,
            "token_type": "bearer"
        }


auth_service = AuthService()