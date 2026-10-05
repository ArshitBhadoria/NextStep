import os

from dotenv import load_dotenv
from google import genai
from google.genai import types


# ================= ENV =================

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError(
        "GEMINI_API_KEY not found in backend/.env"
    )


# ================= GEMINI CLIENT =================

client = genai.Client(
    api_key=api_key
)


# ================= WEB SEARCH AGENT =================

def analyze_with_web(profile, purpose, situation):

    prompt = f"""
You are DUE, an entitlement discovery assistant.

USER PROFILE:
{profile}

USER PURPOSE:
{purpose}

USER SITUATION:
{situation}


TASK:

Search the web for CURRENT and RELEVANT information
related to the user's situation.

Prefer authoritative sources such as:

- Government websites
- Official scholarship portals
- Official company policy pages
- Official insurance websites
- Official regulatory websites
- Official organization websites


IMPORTANT:

Do NOT invent:

- benefits
- eligibility rules
- deadlines
- amounts
- documents
- policies


Only provide information supported by the web sources.

Do not say that the user is definitely eligible.

Explain that eligibility must be verified from the official source.


Return:

1. SUMMARY

Briefly explain what you found.


2. POTENTIAL ENTITLEMENTS

List relevant:

- scholarships
- financial benefits
- refunds
- compensation
- discounts
- consumer rights
- government schemes
- insurance benefits


For each relevant result explain:

- Name
- Why it may be relevant
- Eligibility information
- Benefit/amount if available
- Deadline if available
- Required documents if available
- Official source


3. IMPORTANT VERIFICATION

Mention anything that the user still needs to verify.
"""


    response = client.models.generate_content(

        model="gemini-3.7-flash",

        contents=prompt,

        config=types.GenerateContentConfig(

            tools=[
                types.Tool(
                    google_search=types.GoogleSearch()
                )
            ]

        )
    )


    # ================= EXTRACT SOURCES =================

    sources = []

    grounding_metadata = getattr(
        response,
        "grounding_metadata",
        None
    )


    if grounding_metadata:

        chunks = getattr(
            grounding_metadata,
            "grounding_chunks",
            []
        ) or []


        for chunk in chunks:

            web = getattr(
                chunk,
                "web",
                None
            )


            if web:

                uri = getattr(
                    web,
                    "uri",
                    None
                )

                title = getattr(
                    web,
                    "title",
                    None
                )


                if uri:

                    sources.append({

                        "title":
                            title or "Web Source",

                        "url":
                            uri

                    })


    # Remove duplicate URLs

    unique_sources = []

    seen_urls = set()


    for source in sources:

        if source["url"] not in seen_urls:

            seen_urls.add(
                source["url"]
            )

            unique_sources.append(
                source
            )


    return {

        "answer":
            response.text,

        "sources":
            unique_sources

    }