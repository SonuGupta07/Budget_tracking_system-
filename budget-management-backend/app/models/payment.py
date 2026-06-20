from sqlalchemy import Column, Integer, Numeric, String, DateTime

from app.core.database import Base


class Payment(Base):
    __tablename__ = "PAYMENTS"

    payment_id = Column("PAYMENT_ID", Integer, primary_key=True)
    user_id = Column("USER_ID", Integer, nullable=False)
    razorpay_order_id = Column("RAZORPAY_ORDER_ID", String(100))
    razorpay_payment_id = Column("RAZORPAY_PAYMENT_ID", String(100))
    razorpay_signature = Column("RAZORPAY_SIGNATURE", String(300))
    amount = Column("AMOUNT", Numeric(12, 2))
    currency = Column("CURRENCY", String(10))
    status = Column("STATUS", String(50))
    payment_method = Column("PAYMENT_METHOD", String(50))
    created_at = Column("CREATED_AT", DateTime)
    updated_at = Column("UPDATED_AT", DateTime)
    
   
