import json


def load_schemes():
    with open("schemes.json", "r", encoding="utf-8") as file:
        return json.load(file)


def find_matching_schemes(user):
    schemes = load_schemes()
    matches = []

    for scheme in schemes:
        reasons = []
        failed = []

        # Income
        if user.income <= scheme["income_limit"]:
            reasons.append("Income criterion matched")
        else:
            failed.append("Income exceeds the scheme limit")

        # Course
        if (
            scheme["course"] == "All"
            or user.course.lower() == scheme["course"].lower()
        ):
            reasons.append("Course criterion matched")
        else:
            failed.append("Course does not match")

        # State
        if (
            scheme["state"] == "All"
            or user.state.lower() == scheme["state"].lower()
        ):
            reasons.append("State criterion matched")
        else:
            failed.append("State does not match")

        # Parent occupation
        if (
            scheme["parent_occupation"] == "All"
            or user.parent_occupation.lower()
            == scheme["parent_occupation"].lower()
        ):
            reasons.append("Parent occupation criterion matched")
        else:
            failed.append("Parent occupation does not match")

        if not failed:
            matches.append({
                "name": scheme["name"],
                "description": scheme["description"],
                "match_reason": reasons,
                "income_limit": scheme["income_limit"]
            })

    return matches