import json
import os
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from groq import Groq
from dotenv import load_dotenv

# Load environment variables (e.g., GROQ_API_KEY)
load_dotenv()

class RAGPipeline:
    def __init__(self, data_path: str = "sample_data/startups.json"):
        self.data_path = data_path
        self.documents = []
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = None
        
        # Initialize Groq client
        self.groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY", "your-groq-key"))
        
        self.load_data()
        self.build_index()

    def load_data(self):
        if not os.path.exists(self.data_path):
            raise FileNotFoundError(f"Data file not found at {self.data_path}")
        with open(self.data_path, 'r', encoding='utf-8') as f:
            self.documents = json.load(f)

    def build_index(self):
        texts = [f"{doc['name']}: {doc['description']}" for doc in self.documents]
        # Fit and transform the documents into a TF-IDF matrix
        self.tfidf_matrix = self.vectorizer.fit_transform(texts)

    def search(self, query: str, top_k: int = 2):
        # Transform the query
        query_vec = self.vectorizer.transform([query])
        
        # Calculate cosine similarity between query and all documents
        similarities = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        
        # Get the indices of the top_k most similar documents
        top_indices = similarities.argsort()[-top_k:][::-1]
        
        results = []
        for idx in top_indices:
            # Only include if there is some similarity
            if similarities[idx] > 0.0:
                results.append(self.documents[idx])
                
        return results

    def generate_evaluation(self, idea: str, retrieved_docs: list) -> dict:
        """
        Synthesize an evaluation using Groq API based on the idea and retrieved context.
        """
        similar_startups = [{"name": doc["name"], "description": doc["description"]} for doc in retrieved_docs]
        
        # Aggregate raw context for the prompt
        if retrieved_docs:
            context_str = "Here is context from similar existing startups and market data to inform your evaluation:\n"
            for i, doc in enumerate(retrieved_docs):
                context_str += f"\nStartup {i+1}: {doc['name']} - {doc['description']}\n"
                context_str += f"Success Factors: {', '.join(doc.get('success_factors', []))}\n"
                context_str += f"Failure Patterns: {', '.join(doc.get('failure_patterns', []))}\n"
                context_str += f"Market Gaps: {', '.join(doc.get('market_gaps', []))}\n"
        else:
            context_str = "Note: No direct competitors were found in the local database for this specific niche. Please rely on your extensive internal knowledge of the market, consumer behavior, and business fundamentals to evaluate this idea."

        prompt = f"""You are an elite startup analyst combining the thinking of a venture capitalist, McKinsey consultant, and experienced founder.

Your goal is NOT to be polite or generic. Your goal is to deliver sharp, insightful, and actionable analysis that helps a founder make a real decision.

Startup Idea:
"{idea}"

{context_str}

Analyze the idea with depth, specificity, and strong opinions.

Your response MUST be a raw JSON object matching EXACTLY this structure (do not add markdown code blocks, just the JSON):
{{
  "executive_verdict": {{
    "decision": "GO / PIVOT / NO-GO",
    "justification": "sharp 1-2 sentence reasoning",
    "score": 8,
    "investor_insight": "a memorable, non-obvious takeaway"
  }},
  "score_breakdown": {{
    "market_demand": {{"score": 8, "explanation": "..."}},
    "competition": {{"score": 4, "explanation": "..."}},
    "differentiation": {{"score": 7, "explanation": "..."}},
    "profitability": {{"score": 6, "explanation": "..."}},
    "scalability": {{"score": 9, "explanation": "..."}}
  }},
  "why_it_will_work": ["Reason 1", "Reason 2", "Reason 3"],
  "why_it_might_fail": ["Risk 1", "Risk 2", "Risk 3"],
  "key_success_factors": ["Factor 1", "Factor 2", "Factor 3"],
  "kill_risks": ["Kill risk 1", "Kill risk 2"],
  "identified_market_gaps": [
    {{"gap": "What the gap is", "monetization": "Why it exists and how it can be monetized"}}
  ],
  "differentiation_ideas": ["Idea 1", "Idea 2", "Idea 3"],
  "target_customer": {{
    "primary_user_segment": "...",
    "core_problem": "...",
    "why_choose_this": "..."
  }},
  "next_steps": ["Step 1", "Step 2", "Step 3"],
  "pivot_direction": "If the idea is weak, suggest a better version of it. Otherwise, return null."
}}
"""

        try:
            # Call Groq API in JSON mode
            chat_completion = self.groq_client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a professional startup evaluator. You always output valid JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model="llama-3.1-8b-instant",
                temperature=0.5,
                max_tokens=1800,
                response_format={"type": "json_object"}
            )
            
            raw_response = chat_completion.choices[0].message.content.strip()
            evaluation_data = json.loads(raw_response)
        except Exception as e:
            print(f"Groq API Error: {e}")
            # Return a fallback empty structure if it fails
            evaluation_data = {
                "executive_verdict": {"decision": "Error", "justification": "Could not generate final verdict using Groq. Please check your API key and connection.", "score": 0, "investor_insight": "None"},
                "score_breakdown": {
                    "market_demand": {"score": 0, "explanation": "Error"},
                    "competition": {"score": 0, "explanation": "Error"},
                    "differentiation": {"score": 0, "explanation": "Error"},
                    "profitability": {"score": 0, "explanation": "Error"},
                    "scalability": {"score": 0, "explanation": "Error"}
                },
                "why_it_will_work": [],
                "why_it_might_fail": [],
                "key_success_factors": [],
                "kill_risks": [],
                "identified_market_gaps": [],
                "differentiation_ideas": [],
                "target_customer": {"primary_user_segment": "Unknown", "core_problem": "Unknown", "why_choose_this": "Unknown"},
                "next_steps": [],
                "pivot_direction": None
            }

        # Combine with similar startups
        evaluation_data["similar_startups"] = similar_startups
        return evaluation_data
