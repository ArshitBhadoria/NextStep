import os

from dotenv import load_dotenv
from perplexity import Perplexity

load_dotenv()

API_KEY = os.getenv("PERPLEXITY_API_KEY")

if not API_KEY:
    raise RuntimeError(
        "PERPLEXITY_API_KEY is missing from .env"
    )

client = Perplexity(
    api_key=API_KEY
)


# ==========================================
# BASIC AI SEARCH
# ==========================================

async def search_perplexity(query: str):

    response = client.responses.create(

        preset="fast-search",

        input=query,

        instructions=(
            "You are a research assistant for NextStep, "
            "a student benefits discovery platform. "
            "Search the web and provide factual, current information. "
            "Prefer official government and institutional sources."
        ),

        tools=[
            {
                "type": "web_search"
            }
        ]
    )

    return {
        "answer": response.output_text
    }


# ==========================================
# SITUATION ANALYSIS
# ==========================================

async def analyze_situation(situation: str):

    query = f"""
You are the AI engine behind NextStep.

A college student has described their situation below:

STUDENT SITUATION:
{situation}

Your job is to discover scholarships, government schemes,
student benefits, financial assistance, fee waivers,
education concessions, reimbursements, and other benefits
that may be relevant to this student.

Search the web for CURRENT information.

IMPORTANT:

1. Prefer official government websites and official
   scholarship-provider websites.

2. Do not invent scholarship names.

3. Do not invent eligibility requirements.

4. Do not invent scholarship amounts.

5. Do not invent deadlines.

6. Do not invent application links.

7. If something cannot be verified, say:
   "Not verified".

8. Do not claim that the student is definitely eligible
   unless the available official criteria clearly establish it.

9. Explain why each opportunity may be relevant.

10. Pay special attention to information the student
    may not know they are entitled to.

Return a clear, easy-to-read answer.

For every relevant opportunity provide:

NAME:
ELIGIBILITY:
BENEFITS:
DEADLINE:
OFFICIAL APPLICATION LINK:
WHY IT MAY BE RELEVANT:
OFFICIAL SOURCE:

At the end provide:

IMPORTANT THINGS TO VERIFY:
- Conditions the student still needs to check
- Missing information
- Official portals they should visit

Keep the answer practical and student-friendly.
"""

    response = client.responses.create(

        preset="fast-search",

        input=query,

        instructions="""
You are NextStep's benefits discovery engine.

Your goal is to help students discover legitimate
scholarships and government/student benefits.

Use web search.

Prefer official sources.

Never fabricate facts, links, deadlines,
eligibility criteria, or benefit amounts.

Clearly distinguish verified information
from information that needs confirmation.
""",

        tools=[
            {
                "type": "web_search"
            }
        ]
    )

    return response.output_text


# ==========================================
# SCHOLARSHIP SEARCH
# ==========================================

async def search_scholarships(profile):

    query = f"""
Find current scholarship opportunities in India for this student.

Student Profile:

Course: {profile.course}
Year: {profile.year}
Family Income: ₹{profile.income}
Category: {profile.category}
State: {profile.state}
Parent Occupation: {profile.parent_occupation}

Find scholarships that may be relevant.

For each scholarship provide:

1. Scholarship name
2. Eligibility criteria
3. Benefits / scholarship amount
4. Application deadline
5. Official application website
6. Official source
7. Why it may be relevant

IMPORTANT:

- Prefer official government sources.
- Do not invent eligibility criteria.
- Do not invent deadlines.
- Do not invent application links.
- If information is unavailable, write "Not found".
- Do not claim definite eligibility unless clearly confirmed.
"""

    response = client.responses.create(

        preset="fast-search",

        input=query,

        instructions="""
You are the scholarship research engine for NextStep.

Search the web for current scholarship information.

Prefer official government and scholarship-provider websites.

Do not make up:
- eligibility criteria
- scholarship amounts
- deadlines
- application URLs

Clearly distinguish confirmed information
from information that requires verification.
""",

        tools=[
            {
                "type": "web_search"
            }
        ]
    )

    return response.output_text
# ==========================================
# INTERNSHIP SEARCH
# ==========================================

async def search_internships(situation: str):

    query = f"""
Find CURRENT internship opportunities in India relevant to this student.

STUDENT SITUATION:
{situation}

Search specifically for beginner-friendly and student-appropriate
internships.

For every relevant internship, provide:

1. Internship / Role Name
2. Company or Organization
3. Eligibility
4. Required Skills
5. Paid / Unpaid status, ONLY if verified
6. Location or Remote
7. Application Deadline
8. Official Application Link
9. Why it may be relevant
10. Official Source

IMPORTANT:

- Search the web for CURRENT opportunities.
- Prefer official company career pages and official organization websites.
- Government and university/research institute opportunities are also useful.
- Do not invent internships.
- Do not invent deadlines.
- Do not invent salaries or stipends.
- Do not invent eligibility requirements.
- Do not invent application links.
- If something cannot be verified, write "Not verified".
- Clearly distinguish verified information from information requiring confirmation.
- Prefer opportunities that are actually open or currently accepting applications.
"""

    response = client.responses.create(

        preset="fast-search",

        input=query,

        instructions="""
You are NextStep's internship discovery engine.

Find real, current internship opportunities for college students.

Prioritize:
- official company career pages
- official organization websites
- government internship portals
- universities
- research institutions

Do not fabricate:
- internship names
- companies
- deadlines
- salaries
- eligibility
- application links

If information cannot be verified, clearly say "Not verified".

Return practical information that a student can use to apply.
""",

        tools=[
            {
                "type": "web_search"
            }
        ]
    )

    return response.output_text
# ==========================================
# STUDENT DISCOUNT SEARCH
# ==========================================

async def search_student_discounts(situation: str):

    query = f"""
You are the Student Discount Discovery Engine for NextStep.

Find CURRENT student discounts, student offers, student plans,
memberships, subscriptions and benefits available to college students.

STUDENT SITUATION:
{situation}

Search the web for REAL and CURRENT offers.

Focus on useful categories such as:

- AI tools
- Software
- Developer tools
- Cloud services
- Productivity tools
- Online learning platforms
- Electronics
- Laptops and accessories
- Entertainment
- Travel
- Food
- Shopping
- Books
- Student memberships
- Other useful student benefits

IMPORTANT:

1. Prefer offers currently available in India.

2. Prefer official company websites and official student-program pages.

3. Do NOT invent discounts.

4. Do NOT invent prices.

5. Do NOT invent eligibility requirements.

6. Do NOT invent student verification requirements.

7. Do NOT invent expiry dates.

8. Do NOT invent application or claim links.

9. If something cannot be verified, write:
"Not verified."

10. Do not present expired offers as current offers.

11. Clearly mention when student verification is required.

12. Prefer direct official links where the student can claim or
learn about the offer.

For every relevant offer provide:

NAME:
COMPANY:
CATEGORY:
DISCOUNT / BENEFIT:
STUDENT ELIGIBILITY:
STUDENT VERIFICATION:
PRICE / STUDENT PRICE:
LOCATION AVAILABILITY:
VALIDITY:
OFFICIAL LINK:
WHY IT MAY BE USEFUL:
OFFICIAL SOURCE:

At the end provide:

IMPORTANT TO VERIFY:

- Student eligibility
- College email requirement
- Student ID requirement
- Country restrictions
- Current availability
- Terms and conditions

The goal is to DISCOVER real opportunities for the student.

Do not rank the offers or declare one offer as the best.
"""

    response = client.responses.create(

        preset="fast-search",

        input=query,

        instructions="""
You are NextStep's Student Discount Discovery Engine.

Search the web for current student discounts and offers.

Prefer official company and organization websites.

Never fabricate:

- discounts
- prices
- eligibility
- deadlines
- expiry dates
- verification requirements
- application links

If information cannot be verified, clearly say:
"Not verified."

Only present currently available offers as current.
""",

        tools=[
            {
                "type": "web_search"
            }
        ]
    )

    return response.output_text
# ==========================================
# TRAVEL BENEFITS SEARCH
# ==========================================

async def search_travel_benefits(situation: str):

    query = f"""
You are NextStep's Travel Benefits Discovery Engine.

Find CURRENT and REAL travel benefits available to college students.

STUDENT SITUATION:
{situation}

Search the web and discover relevant travel benefits.

Look for:

- Railway student concessions
- Bus student concessions
- Flight student fares
- Student flight discounts
- Student travel cards
- Youth travel programs
- Hotel discounts for students
- Travel memberships
- Government travel benefits
- University travel benefits
- International student travel benefits
- Other student-specific travel offers

IMPORTANT RULES:

1. Search for CURRENT information.

2. Prefer benefits available in India.

3. Prefer official sources such as:
   - Government websites
   - Indian Railways
   - State transport authorities
   - Airlines
   - Universities
   - Official company websites
   - Official student programs

4. Do NOT invent any benefit.

5. Do NOT invent discounts or concession percentages.

6. Do NOT invent prices.

7. Do NOT invent eligibility requirements.

8. Do NOT invent deadlines or validity periods.

9. Do NOT invent application or booking links.

10. If a detail cannot be verified, write:
"Not verified."

11. Do not present an expired or closed offer as currently available.

12. Clearly explain whether the benefit is:
    - Currently available
    - Eligibility unclear
    - Not currently available

13. Prefer benefits that a college student can actually use.

For EVERY relevant travel benefit provide:

NAME:
ORGANIZATION:
TYPE:
BENEFIT:
ELIGIBILITY:
STUDENT VERIFICATION REQUIRED:
DISCOUNT / CONCESSION:
PRICE:
LOCATION / COVERAGE:
VALIDITY:
OFFICIAL APPLICATION / BOOKING LINK:
WHY IT MAY BE USEFUL:
OFFICIAL SOURCE:

At the end provide:

IMPORTANT TO VERIFY:

- Student eligibility
- Student ID requirement
- College/university requirement
- Location restrictions
- Current availability
- Terms and conditions

The goal is to DISCOVER real travel benefits that students may
not know about.

Do not rank the benefits.
Do not give scores.
Do not declare one benefit as the best.
"""

    response = client.responses.create(

        preset="fast-search",

        input=query,

        instructions="""
You are NextStep's Travel Benefits Discovery Engine.

Search the web for CURRENT travel benefits for college students.

Prioritize official government, transport, airline,
university and company sources.

Never fabricate:

- benefits
- discounts
- concessions
- prices
- eligibility
- validity dates
- application links

If something cannot be verified, write:
"Not verified."

Only describe an opportunity as CURRENT if the web evidence
supports that it is currently available.
""",

        tools=[
            {
                "type": "web_search"
            }
        ]
    )

    return response.output_text
# ==========================================
# COLLEGE & ACADEMIC RIGHTS SEARCH
# ==========================================

async def search_academic_rights(situation: str):

    query = f"""
You are NextStep's College and Academic Rights Discovery Engine.

STUDENT SITUATION:
{situation}

Find CURRENT and RELEVANT academic rights, student rights,
college regulations, protections, procedures and entitlements
that may apply to this student's situation in India.

Search for things such as:

- Attendance rules and exemptions
- Examination rights
- Re-examination / supplementary examination rules
- Internal assessment rules
- Backlog and academic progression rules
- Result and revaluation rights
- Answer-sheet inspection
- Grace marks rules
- Academic grievance procedures
- Anti-ragging protections
- Harassment and discrimination protections
- Fee-related academic rights
- Refund rules where academically relevant
- Scholarship-related academic requirements
- Hostel-related academic rules
- Internship / placement-related academic rules
- Disability / accessibility provisions
- Medical leave and attendance provisions
- Academic misconduct procedures
- Disciplinary procedures
- University grievance mechanisms
- Student complaint mechanisms
- UGC / AICTE / university regulations
- College or university-specific academic regulations

IMPORTANT:

1. Search the web for CURRENT information.

2. Prefer official sources:
   - UGC
   - AICTE
   - Ministry of Education
   - University websites
   - College regulations
   - Government websites
   - Official regulatory bodies

3. Prefer the student's own university/college rules when
   the situation contains enough information to identify them.

4. Do NOT invent any rule.

5. Do NOT assume that a general UGC/AICTE rule automatically
   applies to every college.

6. Clearly distinguish between:
   - Central/general regulations
   - University regulations
   - College-specific regulations
   - State-specific rules

7. Do NOT invent deadlines, appeal periods, authorities,
   penalties or procedures.

8. If something cannot be verified, write:
   "Not verified."

9. If rules differ between institutions, clearly say so.

10. If the student's situation does not provide enough
    information, explain what information is missing.

FOR EVERY RELEVANT RIGHT OR RULE PROVIDE:

RIGHT / RULE:
AUTHORITY:
APPLICABILITY:
WHAT IT MEANS:
WHO IT MAY APPLY TO:
PROCEDURE:
IMPORTANT DEADLINE:
DOCUMENTS / EVIDENCE:
OFFICIAL SOURCE:
OFFICIAL LINK:
WHY IT MAY MATTER:

Only provide information supported by reliable sources.

At the end provide:

IMPORTANT TO VERIFY:

- College/university regulations
- Current academic year rules
- University ordinances
- Student handbook
- Examination regulations
- Applicable deadlines
- Official grievance procedure

Do not rank rights.
Do not give scores.
Do not declare one rule as better than another.

The goal is to help students DISCOVER academic rights
they may not know about.
"""

    response = client.responses.create(

        preset="fast-search",

        input=query,

        instructions="""
You are NextStep's College and Academic Rights Discovery Engine.

Search the web for CURRENT academic rights and regulations
relevant to college students in India.

Prioritize official sources such as:

- UGC
- AICTE
- Ministry of Education
- Universities
- Colleges
- Government departments
- Official regulatory authorities

Prefer institution-specific regulations when available.

Never fabricate:

- rules
- rights
- eligibility
- deadlines
- procedures
- authorities
- penalties
- application links

Do not assume that a general regulation applies to every
college or university.

Clearly identify the authority and scope of every rule.

If information cannot be verified, write:
"Not verified."

Provide practical information that helps a student understand
what they can check or do next.
""",

        tools=[
            {
                "type": "web_search"
            }
        ]
    )

    return response.output_text
# ==========================================
# REFUNDS & COMPENSATION SEARCH
# ==========================================

async def search_refunds_compensation(situation: str):

    query = f"""
You are NextStep's Refunds and Compensation Discovery Engine.

STUDENT SITUATION:
{situation}

Find CURRENT and RELEVANT refund, reimbursement, compensation,
cancellation, consumer protection and student-related financial
entitlements that may apply to this situation in India.

Search for things such as:

- College fee refunds
- Course cancellation refunds
- Admission cancellation refunds
- Hostel fee refunds
- Examination fee refunds
- Duplicate payment refunds
- Scholarship-related reimbursement
- Travel ticket refunds
- Flight cancellation compensation
- Railway refund rules
- Bus ticket refunds
- Event cancellation refunds
- Online course refunds
- Subscription cancellation refunds
- Consumer protection remedies
- Service failure compensation
- Delayed/cancelled services
- Security deposit refunds
- Application fee refunds
- University/college refund policies
- Government compensation schemes
- Other legitimate student financial claims

IMPORTANT RULES:

1. Search the web for CURRENT information.

2. Prefer official sources such as:
   - Government websites
   - Consumer Affairs
   - RBI
   - IRCTC / Indian Railways
   - Airlines
   - Universities
   - Colleges
   - UGC
   - AICTE
   - Official company websites
   - Official regulatory authorities

3. Prefer rules and policies that directly apply to the
   student's situation.

4. Do NOT invent refunds or compensation.

5. Do NOT invent compensation amounts.

6. Do NOT invent refund percentages.

7. Do NOT invent deadlines.

8. Do NOT invent eligibility requirements.

9. Do NOT invent application or complaint links.

10. If information cannot be verified, write:
"Not verified."

11. Clearly distinguish between:
    - Legal/regulatory entitlement
    - Institution/company policy
    - Possible remedy
    - General information

12. Do not assume that every student automatically qualifies
    for a refund or compensation.

13. If the situation depends on specific terms and conditions,
    clearly mention that.

FOR EVERY RELEVANT RESULT PROVIDE:

REFUND / COMPENSATION:
AUTHORITY:
TYPE:
APPLICABILITY:
WHAT THE STUDENT MAY BE ENTITLED TO:
ELIGIBILITY:
AMOUNT / REFUND:
DEADLINE:
HOW TO CLAIM:
DOCUMENTS REQUIRED:
OFFICIAL LINK:
OFFICIAL SOURCE:
WHY IT MAY APPLY:

Only provide amounts, percentages and deadlines when verified.

At the end provide:

IMPORTANT TO VERIFY:

- Terms and conditions
- College/university refund policy
- Cancellation date
- Payment records
- Student eligibility
- Applicable deadlines
- Official complaint mechanism
- Supporting documents

The goal is to help students discover legitimate refunds,
reimbursements and compensation they may otherwise miss.

Do not rank the opportunities.
Do not give scores.
Do not declare one option as the best.
"""

    response = client.responses.create(

        preset="fast-search",

        input=query,

        instructions="""
You are NextStep's Refunds and Compensation Discovery Engine.

Search the web for CURRENT refund, reimbursement and compensation
rules relevant to students in India.

Prioritize official sources and first-party policies.

Never fabricate:

- refund amounts
- compensation
- eligibility
- deadlines
- procedures
- complaint authorities
- application links

Clearly distinguish between an actual entitlement, an institutional
policy and a possible remedy.

If something cannot be verified, write:
"Not verified."

Provide practical information about what the student can check
and how they may claim a legitimate refund or compensation.
""",

        tools=[
            {
                "type": "web_search"
            }
        ]
    )

    return response.output_text