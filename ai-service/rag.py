
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

KNOWLEDGE_DIR = os.path.join(os.path.dirname(__file__), "knowledge")
class KnowledgeBase:
    def __init__(self, folder: str = KNOWLEDGE_DIR):
        self.chunks = []       
        self.sources = []      
        self._load(folder)
        self.vectorizer = TfidfVectorizer(stop_words="english")
        self.matrix = self.vectorizer.fit_transform(self.chunks)

    def _load(self, folder: str):
        for filename in sorted(os.listdir(folder)):
            if not filename.endswith(".txt"):
                continue
            path = os.path.join(folder, filename)
            with open(path, "r", encoding="utf-8") as f:
                text = f.read()
            # simple chunking: split by blank-line paragraphs, fall back to whole file
            paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
            if not paragraphs:
                paragraphs = [text.strip()]
            for p in paragraphs:
                self.chunks.append(p)
                self.sources.append(filename)

    def retrieve(self, query: str, top_k: int = 3):
        query_vec = self.vectorizer.transform([query])
        scores = cosine_similarity(query_vec, self.matrix)[0]
        ranked_indices = scores.argsort()[::-1][:top_k]
        results = []
        for i in ranked_indices:
            if scores[i] <= 0:
                continue
            results.append({
                "text": self.chunks[i],
                "source": self.sources[i],
                "score": float(scores[i]),
            })
        return results

knowledge_base = KnowledgeBase()
