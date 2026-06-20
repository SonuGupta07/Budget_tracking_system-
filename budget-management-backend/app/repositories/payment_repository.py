from datetime import datetime

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.payment import Payment
from app.models.user_premium_status import UserPremiumStatus


class PaymentRepository:

    @staticmethod
    def get_payment_next_id(db: Session):
        result = db.execute(text("SELECT PAYMENT_SEQ.NEXTVAL FROM DUAL"))
        return result.scalar()

    @staticmethod
    def get_premium_next_id(db: Session):
        result = db.execute(text("SELECT PREMIUM_STATUS_SEQ.NEXTVAL FROM DUAL"))
        return result.scalar()

    @staticmethod
    def create_payment(db: Session, payment: Payment):
        db.add(payment)
        db.commit()
        db.refresh(payment)
        return payment

    @staticmethod
    def get_payment_by_order_id(db: Session, order_id: str):
        return (
            db.query(Payment)
            .filter(Payment.razorpay_order_id == order_id)
            .first()
        )

    @staticmethod
    def update_payment(db: Session, payment: Payment):
        payment.updated_at = datetime.now()
        db.commit()
        db.refresh(payment)
        return payment

    @staticmethod
    def get_premium_by_user(db: Session, user_id: int):
        return (
            db.query(UserPremiumStatus)
            .filter(UserPremiumStatus.user_id == user_id)
            .first()
        )

    @staticmethod
    def create_premium_status(db: Session, user_id: int, plan_name: str, start_date, end_date):
        premium = UserPremiumStatus(
            premium_id=PaymentRepository.get_premium_next_id(db),
            user_id=user_id,
            is_premium="Y",
            plan_name=plan_name,
            start_date=start_date,
            end_date=end_date,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )

        db.add(premium)
        db.commit()
        db.refresh(premium)
        return premium

    @staticmethod
    def update_premium_status(db: Session, premium: UserPremiumStatus, plan_name: str, start_date, end_date):
        premium.is_premium = "Y"
        premium.plan_name = plan_name
        premium.start_date = start_date
        premium.end_date = end_date
        premium.updated_at = datetime.now()

        db.commit()
        db.refresh(premium)
        return premium