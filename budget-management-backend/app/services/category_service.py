from sqlalchemy.orm import Session

from app.models.category import Category

from app.repositories.category_repository import (
    CategoryRepository
)


class CategoryService:

    @staticmethod
    def create_category(
        db: Session,
        request
    ):

        category = Category(

            category_id=
            CategoryRepository.get_next_id(
                db
            ),

            category_name=
            request.category_name,

            category_type=
            request.category_type
        )

        return (
            CategoryRepository.create(
                db,
                category
            )
        )

    @staticmethod
    def get_all_categories(
        db: Session
    ):

        return (
            CategoryRepository.get_all(
                db
            )
        )


category_service = CategoryService()