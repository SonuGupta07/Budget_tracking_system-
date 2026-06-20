from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.user_role import UserRole


class UserRoleRepository:

    @staticmethod
    def get_next_id(
        db: Session
    ):

        result = db.execute(
            text(
                "SELECT USER_ROLES_SEQ.NEXTVAL FROM DUAL"
            )
        )

        return result.scalar()

    @staticmethod
    def create(
        db: Session,
        user_role
    ):

        db.add(user_role)

        db.commit()

        db.refresh(user_role)

        return user_role