# Auto-generated placeholder: app/repositories/category_repository.py
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.category import Category


class CategoryRepository:

    @staticmethod
    def get_next_id(
        db: Session
    ):
        result = db.execute(
            text(
                "SELECT CATEGORY_SEQ.NEXTVAL FROM DUAL"
            )
        )

        return result.scalar()

    @staticmethod
    def create(
        db: Session,
        category
    ):

        db.add(category)

        db.commit()

        db.refresh(category)

        return category

    @staticmethod
    def get_all(
        db: Session
    ):

        return (
            db.query(Category)
            .all()
        )
    @staticmethod
    def get_by_id(
    db,
    category_id: int
):
     return (
        db.query(Category)
        .filter(
            Category.category_id == category_id
        )
        .first()
    )