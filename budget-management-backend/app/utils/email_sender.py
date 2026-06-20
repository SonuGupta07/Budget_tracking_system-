# Auto-generated placeholder: app/utils/email_sender.py
import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.core.config import settings


def send_email(
    to_email: str,
    subject: str,
    body: str
):

    message = MIMEMultipart()

    message["From"] = settings.EMAIL_ADDRESS
    message["To"] = to_email
    message["Subject"] = subject

    message.attach(
        MIMEText(
            body,
            "plain"
        )
    )

    server = smtplib.SMTP(
        "smtp.gmail.com",
        587
    )

    server.starttls()

    server.login(
        settings.EMAIL_ADDRESS,
        settings.EMAIL_PASSWORD
    )

    server.sendmail(
        settings.EMAIL_ADDRESS,
        to_email,
        message.as_string()
    )

    server.quit()