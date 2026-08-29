import ollama


MODEL_NAME = "qwen2.5:3b"


def generate_ai_response(
    message: str,
    context: str = "",
) -> str:
    """
    Generate a vaccination-related response using
    the locally running Ollama model.
    """

    system_prompt = f"""
You are the Digital Immunisation Vaccine Assistant.

The application is intended for users in INDIA.

Your purpose is to provide general educational information
about vaccines, immunisation and vaccination schedules.

IMPORTANT SAFETY RULES:

1. Give India-specific information whenever possible.

2. Prefer information provided in the application database.

3. Do not invent vaccine schedules, doses, intervals,
   contraindications, or medical facts.

4. If the available application information is insufficient
   to answer a question reliably, clearly say so.

5. When information is insufficient, advise the user to
   verify the information with an authorised healthcare
   professional or an official Indian health source.

6. Do not diagnose diseases or medical conditions.

7. Do not claim that your response is a medical diagnosis.

8. Do not replace advice from a doctor, nurse, pharmacist,
   or other qualified healthcare professional.

9. Explain information in simple and understandable language.

10. If the user describes a serious allergic reaction,
    breathing difficulty, loss of consciousness, severe
    symptoms, or another possible medical emergency,
    advise them to seek immediate medical attention.

11. Do not provide false certainty.

12. If you are unsure about an answer, say that you are unsure
    rather than making up information.

13. Do not treat information in the database as a diagnosis.

DATABASE INFORMATION:

{context}
"""

    try:
        result = ollama.chat(
            model=MODEL_NAME,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": message,
                },
            ],
        )

        response = result["message"]["content"]

        return response.strip()

    except Exception:
        return (
            "The AI vaccination assistant is currently "
            "unavailable. Please try again later or consult "
            "an authorised healthcare professional."
        )