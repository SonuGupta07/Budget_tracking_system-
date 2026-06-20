import google.generativeai as genai

from app.core.config import settings

from app.repositories.ai_repository import (
    AIRepository
)

from app.repositories.analytics_repository import (
    AnalyticsRepository
)

genai.configure(
    api_key=settings.GEMINI_API_KEY
)


class AIService:

    @staticmethod
    def categorize_expense(
        db,
        expense_id,
        description
    ):

        model = genai.GenerativeModel(
            "gemini-2.5-flash"
        )

        prompt = f"""
        Categorize this expense into ONE category only.

        Expense:
        {description}

        Possible categories:
        Food
        Travel
        Shopping
        Bills
        Healthcare
        Education
        Entertainment
        Investment
        Other

        Return only category name.
        """

        response = model.generate_content(
            prompt
        )

        category = response.text.strip()

        confidence = 95

        AIRepository.save_expense_prediction(
            db,
            expense_id,
            category,
            confidence
        )

        return {
            "expense_id": expense_id,
            "category": category,
            "confidence": confidence
        }

    @staticmethod
    def budget_advisor(
        db,
        user_id
    ):

        financial_data = (
            AnalyticsRepository
            .get_budget_advisor_data(
                db,
                user_id
            )
        )

        model = genai.GenerativeModel(
            "gemini-2.5-flash"
        )

        prompt = f"""
        You are an expert financial advisor.

        Income:
        {financial_data['income']}

        Expense:
        {financial_data['expense']}

        Budget:
        {financial_data['budget']}

        Savings:
        {financial_data['savings']}

        Rules:

        1. Maximum 5 recommendations
        2. Maximum 150 words
        3. Practical advice only
        4. No headings
        5. Short bullet points
        """

        response = model.generate_content(
            prompt
        )

        recommendation = (
            response.text.strip()
        )

        AIRepository.save_budget_recommendation(
            db,
            user_id,
            recommendation
        )

        return {
            "user_id": user_id,
            "income": financial_data["income"],
            "expense": financial_data["expense"],
            "budget": financial_data["budget"],
            "savings": financial_data["savings"],
            "recommendation": recommendation
        }

    @staticmethod
    def spending_insights(
        db,
        user_id
    ):

        highest_category = (
            AnalyticsRepository
            .get_highest_spending_category(
                db,
                user_id
            )
        )

        total_income = (
            AnalyticsRepository
            .get_total_income(
                db,
                user_id
            )
        )

        total_expense = (
            AnalyticsRepository
            .get_total_expense(
                db,
                user_id
            )
        )

        savings_rate = 0

        if total_income > 0:

            savings_rate = round(
                (
                    (
                        total_income -
                        total_expense
                    )
                    /
                    total_income
                ) * 100,
                2
            )

        model = genai.GenerativeModel(
            "gemini-2.5-flash"
        )

        prompt = f"""
        Analyze this financial data.

        Highest Spending Category:
        {highest_category.category_name if highest_category else "None"}

        Highest Spending Amount:
        {float(highest_category.total_amount) if highest_category else 0}

        Total Income:
        {float(total_income)}

        Total Expense:
        {float(total_expense)}

        Savings Rate:
        {savings_rate}%

        Rules:

        1. Give exactly 4 insights
        2. Maximum 100 words
        3. Practical advice only
        4. Short bullet points
        5. No headings
        """

        response = model.generate_content(
            prompt
        )

        insights = (
            response.text.strip()
        )

        return {

            "highest_spending_category":
            (
                highest_category.category_name
                if highest_category
                else None
            ),

            "highest_spending_amount":
            (
                float(
                    highest_category.total_amount
                )
                if highest_category
                else 0
            ),

            "total_income":
            float(total_income),

            "total_expense":
            float(total_expense),

            "savings_rate":
            savings_rate,

            "insights":
            insights
        }

    @staticmethod
    def savings_recommendation(
        db,
        user_id
    ):

        goal = (
            AnalyticsRepository
            .get_savings_goal_data(
                db,
                user_id
            )
        )

        if not goal:

            return {
                "message":
                "No savings goal found"
            }

        model = genai.GenerativeModel(
            "gemini-2.5-flash"
        )

        prompt = f"""
        You are a savings coach.

        Goal Name:
        {goal.goal_name}

        Target Amount:
        {goal.target_amount}

        Current Amount:
        {goal.current_amount}

        Target Date:
        {goal.target_date}

        Rules:

        1. Maximum 4 bullet points
        2. Maximum 80 words
        3. Practical savings advice only
        4. No headings
        5. Short recommendations
        """

        response = model.generate_content(
            prompt
        )

        recommendation = (
            response.text.strip()
        )

        AIRepository.save_budget_recommendation(
            db,
            user_id,
            recommendation
        )

        return {

            "goal_name":
            goal.goal_name,

            "target_amount":
            float(goal.target_amount),

            "current_amount":
            float(goal.current_amount),

            "recommendation":
            recommendation
        }
    @staticmethod
    def financial_chatbot(
    db,
    user_id,
    question
):

     financial_data = (
        AnalyticsRepository
        .get_budget_advisor_data(
            db,
            user_id
        )
    )

     model = genai.GenerativeModel(
        "gemini-2.5-flash"
    )

     prompt = f"""
    You are an AI Financial Assistant.

    User Financial Summary:

     Income:
    {financial_data['income']}

     Expense:
    {financial_data['expense']}

     Budget:
    {financial_data['budget']}

     Savings:
    {financial_data['savings']}

     User Question:
    {question}

     Rules:

    1. Maximum 150 words
    2. Practical financial advice
    3. Simple language
    4. No markdown
    5. Answer only the question
    """

     response = model.generate_content(
        prompt
    )

     answer = response.text.strip()

     AIRepository.save_chat_history(
        db,
        user_id,
        question,
        answer
    )

     return {

        "user_id": user_id,

        "question": question,

        "answer": answer
    }


ai_service = AIService()