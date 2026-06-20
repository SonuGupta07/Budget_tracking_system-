from pydantic import BaseModel


class CreateOrderRequest(BaseModel):
    user_id: int
    plan_code: str = "PREMIUM_MONTHLY"


class VerifyPaymentRequest(BaseModel):
    user_id: int
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str