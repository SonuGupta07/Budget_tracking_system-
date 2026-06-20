from sqlalchemy import Column, Integer, String, DateTime

from app.core.database import Base


class UserPremiumStatus(Base):
    __tablename__ = "USER_PREMIUM_STATUS"

    premium_id = Column("PREMIUM_ID", Integer, primary_key=True)
    user_id = Column("USER_ID", Integer, nullable=False)
    is_premium = Column("IS_PREMIUM", String(1))
    plan_name = Column("PLAN_NAME", String(100))
    start_date = Column("START_DATE", DateTime)
    end_date = Column("END_DATE", DateTime)
    created_at = Column("CREATED_AT", DateTime)
    updated_at = Column("UPDATED_AT", DateTime)