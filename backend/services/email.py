import os
import smtplib
from email.message import EmailMessage

from dotenv import load_dotenv


load_dotenv()


GMAIL_USERNAME = os.getenv("GMAIL_USERNAME")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")


def send_password_reset_email(
    recipient_email: str,
    reset_link: str,
):
    if not GMAIL_USERNAME or not GMAIL_APP_PASSWORD:
        raise RuntimeError(
            "Gmail email configuration is missing."
        )

    message = EmailMessage()

    message["Subject"] = "Digital Immunisation - Password Reset"
    message["From"] = GMAIL_USERNAME
    message["To"] = recipient_email

    message.set_content(
        f"""Hello,

We received a request to reset your Digital Immunisation account password.

Click the link below to reset your password:

{reset_link}

This password reset link will expire in 15 minutes.

If you did not request a password reset, you can safely ignore this email.

Digital Immunisation System
"""
    )

    with smtplib.SMTP(
        "smtp.gmail.com",
        587,
    ) as smtp:
        smtp.starttls()

        smtp.login(
            GMAIL_USERNAME,
            GMAIL_APP_PASSWORD,
        )

        smtp.send_message(message)