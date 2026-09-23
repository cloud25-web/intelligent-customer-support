from sentence_transformers import SentenceTransformer
import numpy as np

from .knowledge_base import load_documents


model = SentenceTransformer("all-MiniLM-L6-v2")


documents = load_documents()

texts = [doc["text"] for doc in documents]

embeddings = model.encode(
    texts,
    normalize_embeddings=True
)


def retrieve(query: str, top_k: int = 2):

    query_embedding = model.encode(
        [query],
        normalize_embeddings=True
    )[0]

    scores = np.dot(embeddings, query_embedding)

    top_indices = np.argsort(scores)[::-1][:top_k]

    results = []

    for index in top_indices:
        results.append({
            "source": documents[index]["source"],
            "text": documents[index]["text"],
            "score": float(scores[index])
        })

    return results