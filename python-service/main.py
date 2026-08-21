#python classes for ResourceSearchEngine and ContentClassifier wrapped in FastAaPI
#the classifier finds the category in case user doesnot send the category/query and send to the resource seracher and it giev out the result
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Optional

from resource_analyzer import HealthResourceAnalyzer

app = FastAPI(title="HealthBridge Python Service")
class ContentClassifier:
    CATEGORY_KEYWORDS = {
        "Nutrition": ["diet", "food", "nutrition", "eating", "meal"],
        "Hygiene": ["hygiene", "handwash", "hand wash", "clean", "sanitation", "wash"],
        "Vaccination": ["vaccine", "vaccination", "immunization", "shot"],
        "First Aid": ["first aid", "wound", "burn", "bleeding", "emergency", "choking"],
        "Preventive Care": ["checkup", "screening", "prevention", "prevent"],
        "Healthy Lifestyle": ["exercise", "sleep", "stress", "wellness", "lifestyle"],
    }

    def classify(self, text: str) -> str:
        text_lower = text.lower()
        best_category = "Preventive Care" 
        best_matches = 0
        for category, keywords in self.CATEGORY_KEYWORDS.items():
            matches = sum(1 for kw in keywords if kw in text_lower)
            if matches > best_matches:
                best_matches = matches
                best_category = category
        return best_category

class ResourceSearchEngine:
    def __init__(self, classifier: ContentClassifier):
        self.classifier = classifier

    def search(self, query: str, resources: List[dict]) -> List[dict]:
        query_terms = query.lower().split()
        scored = []
        for r in resources:
            haystack = f"{r.get('name','')} {r.get('description','')} {r.get('category','')}".lower()
            score = sum(1 for term in query_terms if term in haystack)
            if score > 0:
                scored.append({**r, "relevance_score": score})
        return sorted(scored, key=lambda r: r["relevance_score"], reverse=True)

    def auto_categorize(self, resources: List[dict]) -> List[dict]:
        for r in resources:
            if not r.get("category"):
                r["category"] = self.classifier.classify(r.get("description", r.get("name", "")))
        return resources


classifier = ContentClassifier()
engine = ResourceSearchEngine(classifier)
resource_analyzer = HealthResourceAnalyzer()


class ClassifyRequest(BaseModel):
    text: str


class SearchRequest(BaseModel):
    query: str
    resources: List[dict]
    # app fetches raw health articles from its database


class AnalyzeRequest(BaseModel):
    name: str
    description: str
    location: Optional[str] = ""


@app.post("/classify")
def classify_endpoint(req: ClassifyRequest):
    return {"category": classifier.classify(req.text)}


@app.post("/search")
def search_endpoint(req: SearchRequest):
    categorized = engine.auto_categorize(req.resources)
    return {"results": engine.search(req.query, categorized)}


@app.post("/analyze")
def analyze_endpoint(req: AnalyzeRequest):
    """
    Used by the Node backend's POST /api/resources/:id/analyze route
    (see backend/src/services/pythonService.js). Classifies a resource
    into the same category taxonomy used by the Resource Mongo model
    (clinic, vaccination, emergency, mental_wellness, preventive_care,
    public_health).
    """
    return resource_analyzer.analyze_resource(req.model_dump())


@app.get("/categories")
def categories_endpoint():
    return {"categories": list(ContentClassifier.CATEGORY_KEYWORDS.keys())}


@app.get("/health")
def health():
    return {"status": "ok"}
