# Auto-generated placeholder: app/repositories/role_repository.py
from sqlalchemy.orm import Session

from app.models.role import Role


class RoleRepository:

    @staticmethod
    def get_by_name(
        db: Session,
        role_name: str
    ):
        return (
            db.query(Role)
            .filter(
                Role.role_name == role_name
            )
            .first()
        )
    @staticmethod
    def get_user_role(
    db: Session
    ):
       return (
        db.query(Role)
        .filter(
            Role.role_name == "ROLE_USER"
        )
        .first()
      )