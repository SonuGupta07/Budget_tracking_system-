# Auto-generated placeholder: app/models/category.py
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from app.core.database import Base


class Category(Base):

    __tablename__ = "CATEGORIES"

    category_id = Column(
        "CATEGORY_ID",
        Integer,
        primary_key=True
    )

    category_name = Column(
        "CATEGORY_NAME",
        String(100)
    )

    category_type = Column(
        "CATEGORY_TYPE",
        String(20)
    )