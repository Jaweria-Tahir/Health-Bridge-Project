class HealthResourceAnalyzer:
    """
    Analyzes and classifies HealthBridge health resources.
    """

    CATEGORY_KEYWORDS = {
        "clinic": [
            "clinic",
            "hospital",
            "medical",
            "health center",
            "doctor"
        ],

        "vaccination": [
            "vaccination",
            "vaccine",
            "immunization"
        ],

        "emergency": [
            "emergency",
            "ambulance",
            "urgent",
            "helpline"
        ],

        "mental_wellness": [
            "mental health",
            "counselling",
            "counseling",
            "wellness",
            "psychological"
        ],

        "preventive_care": [
            "preventive",
            "screening",
            "checkup",
            "check-up"
        ],

        "public_health": [
            "public health",
            "community health",
            "health program",
            "health campaign"
        ]
    }

    def __init__(self):
        self.categories = list(self.CATEGORY_KEYWORDS.keys())

    def classify_resource(self, name, description):
        """
        Classify a resource based on its name and description.
        """

        text = f"{name} {description}".lower()

        scores = {
            category: 0
            for category in self.categories
        }

        for category, keywords in self.CATEGORY_KEYWORDS.items():
            for keyword in keywords:
                if keyword in text:
                    scores[category] += 1

        best_category = max(
            scores,
            key=scores.get
        )

        if scores[best_category] == 0:
            best_category = "public_health"

        return {
            "category": best_category,
            "scores": scores
        }

    def analyze_resource(self, resource):
        """
        Analyze a complete health resource.
        """

        name = resource.get("name", "")
        description = resource.get("description", "")

        classification = self.classify_resource(
            name,
            description
        )

        return {
            "name": name,
            "location": resource.get("location", ""),
            "classification": classification["category"],
            "scores": classification["scores"]
        }