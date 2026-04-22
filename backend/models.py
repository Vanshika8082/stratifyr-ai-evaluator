from pydantic import BaseModel
from typing import List, Optional

class StartupIdea(BaseModel):
    idea: str

class SimilarStartup(BaseModel):
    name: str
    description: str

class ExecutiveVerdict(BaseModel):
    decision: str
    justification: str
    score: int
    investor_insight: str

class ScoreBreakdown(BaseModel):
    market_demand: dict
    competition: dict
    differentiation: dict
    profitability: dict
    scalability: dict

class MarketGap(BaseModel):
    gap: str
    monetization: str

class TargetCustomer(BaseModel):
    primary_user_segment: str
    core_problem: str
    why_choose_this: str

class EvaluationResult(BaseModel):
    similar_startups: List[SimilarStartup]
    executive_verdict: ExecutiveVerdict
    score_breakdown: ScoreBreakdown
    why_it_will_work: List[str]
    why_it_might_fail: List[str]
    key_success_factors: List[str]
    kill_risks: List[str]
    identified_market_gaps: List[MarketGap]
    differentiation_ideas: List[str]
    target_customer: TargetCustomer
    next_steps: List[str]
    pivot_direction: Optional[str] = None
