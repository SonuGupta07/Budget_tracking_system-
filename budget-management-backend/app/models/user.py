from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime

from app.core.database import Base


class User(Base):

    __tablename__ = "USERS"

    user_id = Column("USER_ID", Integer, primary_key=True)

    first_name = Column("FIRST_NAME", String(100))

    last_name = Column("LAST_NAME", String(100))

    email = Column("EMAIL", String(255), unique=True)

    phone = Column("PHONE", String(20))

    password_hash = Column("PASSWORD_HASH", String(500))

    is_email_verified = Column("IS_EMAIL_VERIFIED", String(1))

    is_phone_verified = Column("IS_PHONE_VERIFIED", String(1))

    status = Column("STATUS", String(20))

    created_at = Column("CREATED_AT", DateTime)

    updated_at = Column("UPDATED_AT", DateTime)