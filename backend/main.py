from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from eligibility import find_matching_schemes

from perplexity_service import (
    search_perplexity,
    search_scholarships,
    analyze_situation,
    search_internships,
    search_student_discounts,
    search_travel_benefits,
    search_academic_rights,
    search_refunds_compensation
)

load_dotenv()


# ==========================================
# APP
# ==========================================

app = FastAPI(
    title="NextStep API",
    description="AI-powered student benefits and opportunity discovery backend",
    version="1.0.0"
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# MODELS
# ==========================================

class UserProfile(BaseModel):

    income: int
    course: str
    year: int
    category: str
    state: str
    parent_occupation: str


class AnalyzeRequest(BaseModel):

    profile: str
    purpose: str
    situation: str


# ==========================================
# HOME
# ==========================================

@app.get("/")
def home():

    return {
        "status": "online",
        "message": "NextStep Backend is running 🚀"
    }


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


# ==========================================
# AI ANALYZE
# ==========================================

@app.post("/analyze")
async def analyze(request: AnalyzeRequest):

    try:

        # --------------------------------------
        # INTERNSHIPS
        # --------------------------------------

        if request.purpose == "internships":

            result = await search_internships(
                request.situation
            )


        # --------------------------------------
        # STUDENT DISCOUNTS
        # --------------------------------------

        elif request.purpose == "student_discounts":

            result = await search_student_discounts(
                request.situation
            )


        # --------------------------------------
        # TRAVEL BENEFITS
        # --------------------------------------

        elif request.purpose == "travel_benefits":

            result = await search_travel_benefits(
                request.situation
            )


        # --------------------------------------
        # COLLEGE & ACADEMIC RIGHTS
        # --------------------------------------

        elif request.purpose == "education_rights":

            result = await search_academic_rights(
                request.situation
            )


        # --------------------------------------
        # REFUNDS & COMPENSATION
        # --------------------------------------

        elif request.purpose == "refunds":

            result = await search_refunds_compensation(
                request.situation
            )


        # --------------------------------------
        # DEFAULT / OTHER BENEFITS
        # --------------------------------------

        else:

            result = await analyze_situation(
                request.situation
            )


        return {
            "success": True,
            "answer": result,
            "sources": []
        }


    except Exception as e:

        print(
            "ANALYZE ERROR:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {str(e)}"
        )


# ==========================================
# LOCAL SCHOLARSHIP DATABASE
# ==========================================

@app.post("/api/recommend-local")
def recommend_local(
    profile: UserProfile
):

    matches = find_matching_schemes(
        profile
    )

    return {
        "success": True,
        "source": "local_database",
        "user_profile": profile,
        "total_matches": len(matches),
        "matches": matches
    }


# ==========================================
# SCHOLARSHIP SEARCH
# ==========================================

@app.post("/api/recommend")
async def recommend(
    profile: UserProfile
):

    try:

        result = await search_scholarships(
            profile
        )

        return {
            "success": True,
            "source": "Perplexity",
            "user_profile": profile,
            "result": result
        }


    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Scholarship search failed: {str(e)}"
        )


# ==========================================
# PERPLEXITY AI TEST
# ==========================================

@app.get("/api/ai-test")
async def ai_test():

    try:

        result = await search_perplexity(
            "Find current scholarship opportunities "
            "for first-year B.Tech students in India."
        )

        return {
            "success": True,
            "source": "Perplexity",
            "result": result
        }


    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Perplexity test failed: {str(e)}"
        )