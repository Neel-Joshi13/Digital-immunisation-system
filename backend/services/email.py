import os
import smtplib
from email.message import EmailMessage

from dotenv import load_dotenv


load_dotenv()


GMAIL_USERNAME = os.getenv("GMAIL_USERNAME")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")


def send_email(
    recipient_email: str,
    subject: str,
    content: str,
):
    if not GMAIL_USERNAME or not GMAIL_APP_PASSWORD:
        raise RuntimeError(
            "Gmail email configuration is missing."
        )

    message = EmailMessage()

    message["Subject"] = subject
    message["From"] = GMAIL_USERNAME
    message["To"] = recipient_email

    message.set_content(content)

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


def send_password_reset_email(
    recipient_email: str,
    reset_link: str,
):
    send_email(
        recipient_email=recipient_email,
        subject="Digital Immunisation - Password Reset",
        content=f"""Hello,

We received a request to reset your Digital Immunisation account password.

Click the link below to reset your password:

{reset_link}

This password reset link will expire in 15 minutes.

If you did not request a password reset, you can safely ignore this email.

Digital Immunisation System
""",
    )


def send_missed_vaccination_email(
    recipient_email: str,
    patient_name: str,
    missed_doses: list,
):
    dose_lines = []

    for dose in missed_doses:
        dose_lines.append(
            f"""Vaccine: {dose["vaccine_name"]}
Dose: {dose["dose_number"]}
Reason: {dose["reason"]}
"""
        )

    doses_text = "\n".join(dose_lines)

    send_email(
        recipient_email=recipient_email,
        subject="Digital Immunisation - Missed Vaccination Reminder",
        content=f"""Hello {patient_name},

Our records show that the following vaccination dose(s) have not been recorded in your immunisation history:

{doses_text}

Please contact your healthcare centre or a qualified healthcare professional to arrange the appropriate vaccination.

Digital Immunisation System
""",
    )


def send_upcoming_vaccination_email(
    recipient_email: str,
    patient_name: str,
    vaccine_name: str,
    appointment_date: str,
    appointment_time: str,
    centre_name: str,
):
    send_email(
        recipient_email=recipient_email,
        subject="Digital Immunisation - Upcoming Vaccination Reminder",
        content=f"""Hello {patient_name},

This is a reminder about your upcoming vaccination appointment.

Vaccine: {vaccine_name}
Date: {appointment_date}
Time: {appointment_time}
Healthcare Centre: {centre_name}

Please attend your scheduled appointment.

Digital Immunisation System
""",
    )