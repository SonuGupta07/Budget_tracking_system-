from sqlalchemy import Column
from sqlalchemy import Integer

from app.core.database import Base


class UserRole(Base):

    __tablename__ = "USER_ROLES"

    user_role_id = Column(
        "USER_ROLE_ID",
        Integer,
        primary_key=True
    )

    user_id = Column(
        "USER_ID",
        Integer
    )

    role_id = Column(
        "ROLE_ID",
        Integer
    )