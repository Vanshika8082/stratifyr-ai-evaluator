import sys
import os

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from rag_pipeline import RAGPipeline

def test_search():
    try:
        pipeline = RAGPipeline(data_path="sample_data/startups.json")
        query = "plaster paint kit for kids"
        results = pipeline.search(query)
        print(f"Search results for '{query}':")
        print(results)
        
        evaluation = pipeline.generate_evaluation(query, results)
        print("\nEvaluation keys generated:")
        print(evaluation.keys())
        print(f"\nSimilar startups in evaluation: {evaluation.get('similar_startups')}")
        
    except Exception as e:
        print(f"Error during test: {e}")

if __name__ == "__main__":
    test_search()
