import os
import json

from groq import Groq
from dotenv import load_dotenv

from .retriever import retrieve


load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def answer_question(question: str):

    documents = retrieve(question)

    context = "\n\n".join(
        f"Source: {doc['source']}\n{doc['text']}"
        for doc in documents
    )

    prompt = f"""
You are a customer support knowledge reasoning engine.

Answer the customer's question using ONLY the provided company knowledge.

If the knowledge does not contain enough information to answer the question,
say that the information is not available and recommend escalation when appropriate.

Do not invent company policies.

Company knowledge:

{context}

Customer question:

{question}

Return ONLY valid JSON:

{{
    "answer": "string",
    "sources": [],
    "confidence": 0.0,
    "requires_escalation": false
}}
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    result = json.loads(
        response.choices[0].message.content
    )

    return result