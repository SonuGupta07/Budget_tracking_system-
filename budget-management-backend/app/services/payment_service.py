import hashlib
import hmac
from datetime import datetime, timedelta

import requests
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.payment import Payment
from app.repositories.payment_repository import PaymentRepository
from app.repositories.user_repository import UserRepository


PLANS = {
    "PREMIUM_MONTHLY": {
        "plan_name": "Premium Member",
        "amount_rupees": 99,
        "validity_days": 30
    }
}


class PaymentService:

    @staticmethod
    def create_order(db: Session, user_id: int, plan_code: str):
        user = UserRepository.get_by_id(db, user_id)

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        if plan_code not in PLANS:
            raise HTTPException(status_code=400, detail="Invalid plan selected")

        plan = PLANS[plan_code]
        amount_paise = int(plan["amount_rupees"] * 100)

        payload = {
            "amount": amount_paise,
            "currency": "INR",
            "receipt": f"premium_{user_id}_{int(datetime.now().timestamp())}",
            "notes": {
                "user_id": str(user_id),
                "plan_code": plan_code
            }
        }

        response = requests.post(
            "https://api.razorpay.com/v1/orders",
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET),
            json=payload,
            timeout=20
        )

        if response.status_code not in [200, 201]:
            raise HTTPException(
                status_code=400,
                detail=f"Razorpay order creation failed: {response.text}"
            )

        order_data = response.json()

        payment = Payment(
            payment_id=PaymentRepository.get_payment_next_id(db),
            user_id=user_id,
            razorpay_order_id=order_data["id"],
            amount=plan["amount_rupees"],
            currency="INR",
            status="CREATED",
            payment_method="RAZORPAY",
            created_at=datetime.now(),
            updated_at=datetime.now()
        )

        PaymentRepository.create_payment(db, payment)

        return {
            "key_id": settings.RAZORPAY_KEY_ID,
            "order_id": order_data["id"],
            "amount": amount_paise,
            "currency": "INR",
            "plan_code": plan_code,
            "plan_name": plan["plan_name"],
            "description": "BudgetPro Premium Membership"
        }

    @staticmethod
    def verify_payment(
        db: Session,
        user_id: int,
        razorpay_order_id: str,
        razorpay_payment_id: str,
        razorpay_signature: str
    ):
        payment = PaymentRepository.get_payment_by_order_id(db, razorpay_order_id)

        if not payment:
            raise HTTPException(status_code=404, detail="Payment order not found")

        if int(payment.user_id) != int(user_id):
            raise HTTPException(
                status_code=403,
                detail="Payment does not belong to this user"
            )

        generated_signature = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            f"{razorpay_order_id}|{razorpay_payment_id}".encode(),
            hashlib.sha256
        ).hexdigest()

        if generated_signature != razorpay_signature:
            payment.status = "FAILED"
            payment.razorpay_payment_id = razorpay_payment_id
            payment.razorpay_signature = razorpay_signature
            PaymentRepository.update_payment(db, payment)

            raise HTTPException(
                status_code=400,
                detail="Invalid Razorpay payment signature"
            )

        payment.status = "PAID"
        payment.razorpay_payment_id = razorpay_payment_id
        payment.razorpay_signature = razorpay_signature
        PaymentRepository.update_payment(db, payment)

        start_date = datetime.now()
        end_date = start_date + timedelta(days=30)

        existing_premium = PaymentRepository.get_premium_by_user(db, user_id)

        if existing_premium:
            premium = PaymentRepository.update_premium_status(
                db,
                existing_premium,
                "Premium Member",
                start_date,
                end_date
            )
        else:
            premium = PaymentRepository.create_premium_status(
                db,
                user_id,
                "Premium Member",
                start_date,
                end_date
            )

        return {
            "message": "Payment verified successfully",
            "user_id": user_id,
            "is_premium": True,
            "plan_name": premium.plan_name,
            "end_date": premium.end_date
        }

    @staticmethod
    def get_premium_status(db: Session, user_id: int):
        user = UserRepository.get_by_id(db, user_id)

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        premium = PaymentRepository.get_premium_by_user(db, user_id)

        if not premium:
            return {
                "user_id": user_id,
                "is_premium": False,
                "plan_name": None,
                "end_date": None
            }

        is_active = (
            premium.is_premium == "Y"
            and premium.end_date
            and premium.end_date >= datetime.now()
        )

        return {
            "user_id": user_id,
            "is_premium": bool(is_active),
            "plan_name": premium.plan_name if is_active else None,
            "end_date": premium.end_date if is_active else None
        }


payment_service = PaymentService()
