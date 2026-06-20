# Auto-generated placeholder: app/services/email_service.py
from email.message import EmailMessage
import smtplib

from app.core.config import settings


class EmailService:

    @staticmethod
    def send_email(
        to_email: str,
        subject: str,
        body: str
    ):

        message = EmailMessage()

        message["From"] = settings.EMAIL_ADDRESS
        message["To"] = to_email
        message["Subject"] = subject

        message.set_content(body)

        with smtplib.SMTP(
            "smtp.gmail.com",
            587
        ) as smtp:

            smtp.starttls()

            smtp.login(
                settings.EMAIL_ADDRESS,
                settings.EMAIL_PASSWORD
            )

            smtp.send_message(message)


email_service = EmailService()