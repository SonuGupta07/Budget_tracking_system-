from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.payment.payment_schema import (
    CreateOrderRequest,
    VerifyPaymentRequest
)
from app.services.payment_service import payment_service


router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
    dependencies=[Depends(get_current_user)]
)


@router.post("/create-order")
def create_order(
    request: CreateOrderRequest,
    db: Session = Depends(get_db)
):
    return payment_service.create_order(
        db,
        request.user_id,
        request.plan_code
    )


@router.post("/verify-payment")
def verify_payment(
    request: VerifyPaymentRequest,
    db: Session = Depends(get_db)
):
    return payment_service.verify_payment(
        db,
        request.user_id,
        request.razorpay_order_id,
        request.razorpay_payment_id,
        request.razorpay_signature
    )


@router.get("/status/{user_id}")
def get_premium_status(
    user_id: int,
    db: Session = Depends(get_db)
):
    return payment_service.get_premium_status(db, user_id)
