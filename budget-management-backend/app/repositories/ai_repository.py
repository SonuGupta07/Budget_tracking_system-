# Auto-generated placeholder: app/repositories/ai_repository.py
from sqlalchemy import text

from app.models.ai_expense_category import (
    AIExpenseCategorization
)
from app.models.ai_budget_recommendation import (
    AIBudgetRecommendation
)
from app.models.ai_chat import (
    AIChatHistory
)

class AIRepository:

    @staticmethod
    def save_expense_prediction(
        db,
        expense_id,
        category,
        confidence
    ):

        seq = db.execute(
            text(
                """
                SELECT AI_EXPENSE_CATEGORY_SEQ.NEXTVAL
                FROM dual
                """
            )
        ).scalar()

        record = AIExpenseCategorization(

            ai_id=seq,

            expense_id=expense_id,

            predicted_category=category,

            confidence_score=confidence
        )

        db.add(record)

        db.commit()

        db.refresh(record)
        

        return record
    @staticmethod
    def save_budget_recommendation(
    db,
    user_id,
    recommendation_text
):

     from sqlalchemy import text

     seq = db.execute(
        text(
            """
            SELECT AI_BUDGET_RECOMMENDATION_SEQ.NEXTVAL
            FROM dual
            """
        )
    ).scalar()

     recommendation = (
        AIBudgetRecommendation(
            recommendation_id=seq,
            user_id=user_id,
            recommendation_text=recommendation_text
        )
    )

     db.add(recommendation)

     db.commit()

     db.refresh(recommendation)

     return recommendation
    @staticmethod
    def save_chat_history(
    db,
    user_id,
    question,
    response
):

     seq = db.execute(
        text(
            """
            SELECT AI_CHAT_HISTORY_SEQ.NEXTVAL
            FROM dual
            """
        )
    ).scalar()

     chat = AIChatHistory(
        chat_id=seq,
        user_id=user_id,
        question=question,
        response=response
    )

     db.add(chat)

     db.commit()

     db.refresh(chat)

     return chat