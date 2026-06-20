# Auto-generated placeholder: app/models/role.py
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from app.core.database import Base


class Role(Base):

    __tablename__ = "ROLES"

    role_id = Column(
        "ROLE_ID",
        Integer,
        primary_key=True
    )

    role_name = Column(
        "ROLE_NAME",
        String(50)
    )