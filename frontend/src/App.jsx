import { useState } from 'react';
import axios from 'axios';
import { 
  Rocket, 
  Lightbulb, 
  Target, 
  AlertTriangle, 
  CheckCircle2, 
  Search,
  Activity,
  Layers,
  ArrowRight,
  BarChart3,
  TrendingUp,
  Skull,
  Crosshair,
  Sparkles,
  ListTodo,
  Users,
  RefreshCcw,
  MessageSquareQuote
} from 'lucide-react';

function App() {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const analyzeIdea = async (e) => {
    e.preventDefault();
    if (!idea.trim()) return;
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://localhost:8000/analyze-idea', {
        idea: idea
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred while connecting to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-textMain selection:bg-primary/30 relative">
      {/* Animated Background Blobs */}
      <div className="bg-blobs">
        <div className="bg-blob-1"></div>
        <div className="bg-blob-2"></div>
        <div className="bg-blob-3"></div>
      </div>
      {/* Navbar */}
      <nav className="border-b border-borderLight bg-surface/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center shadow-lg shadow-primary/20">
            <Rocket size={18} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Stratifyr</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight">
            Evaluate your startup idea with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">data-driven precision.</span>
          </h1>
          <p className="text-textMuted text-lg mb-8">
            Describe your idea below. Our AI cross-references it against market patterns, identifying gaps, risks, and potential success factors instantly.
          </p>

          <form onSubmit={analyzeIdea} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-indigo-500/20 rounded-xl blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            <div className="relative flex flex-col sm:flex-row gap-4 bg-surface p-2 rounded-xl border border-borderLight shadow-2xl">
              <div className="relative flex-grow flex items-center">
                <Lightbulb className="absolute left-4 text-textMuted" size={20} />
                <input
                  type="text"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="e.g. A marketplace for renting out idle GPU compute..."
                  className="w-full bg-transparent border-none focus:ring-0 text-lg px-12 py-3 placeholder-textMuted/60 outline-none"
                  disabled={loading}
                />
              </div>
              <button 
                type="submit" 
                disabled={loading || !idea.trim()}
                className="btn-primary flex items-center justify-center gap-2 py-3 px-6 whitespace-nowrap w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Activity className="animate-spin" size={18} />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Evaluate Idea
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg flex items-start gap-3 animate-slide-up text-left">
              <AlertTriangle className="shrink-0 mt-0.5" size={18} />
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Loading State Skeleton */}
        {loading && (
          <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
            <div className="h-32 bg-surface rounded-xl border border-borderLight"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-48 bg-surface rounded-xl border border-borderLight"></div>
              <div className="h-48 bg-surface rounded-xl border border-borderLight"></div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && !loading && (
          <div className="max-w-5xl mx-auto space-y-8 animate-slide-up">
            
            {/* Executive Verdict Card */}
            <div className="card bg-gradient-to-b from-surface to-slate-900 border-primary/30 shadow-primary/5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <Target className="text-primary" size={24} />
                  <h2 className="text-2xl font-bold">Executive Verdict</h2>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-1 rounded-full font-bold text-sm tracking-widest uppercase border ${
                    result.executive_verdict.decision.includes('Go') && !result.executive_verdict.decision.includes('No-Go') 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                    : result.executive_verdict.decision.includes('Pivot')
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}>
                    {result.executive_verdict.decision}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">{result.executive_verdict.score}</span>
                    <span className="text-textMuted">/10</span>
                  </div>
                </div>
              </div>
              <p className="text-lg text-textMain leading-relaxed mb-4">
                {result.executive_verdict.justification}
              </p>
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex gap-3">
                <MessageSquareQuote className="text-indigo-400 shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Investor Insight</h4>
                  <p className="text-sm text-indigo-100 italic">"{result.executive_verdict.investor_insight}"</p>
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="card">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="text-indigo-400" size={20} />
                <h3 className="text-xl font-semibold">Score Breakdown</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(result.score_breakdown).map(([key, data]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="capitalize text-slate-300">{key.replace('_', ' ')}</span>
                      <span className="text-primary">{data.score}/10</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full transition-all duration-1000" 
                        style={{ width: `${data.score * 10}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-textMuted mt-1 leading-relaxed">{data.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Why It Will Work */}
              <div className="card !p-5 border-emerald-500/20 bg-gradient-to-b from-surface to-emerald-950/10 hover:border-emerald-500/40">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="text-emerald-400" size={20} />
                  <h3 className="font-semibold text-lg">Why This Will Work</h3>
                </div>
                <ul className="space-y-3">
                  {result.why_it_will_work.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                      <CheckCircle2 className="shrink-0 mt-0.5 text-emerald-500" size={16} />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Why It Might Fail */}
              <div className="card !p-5 border-rose-500/20 bg-gradient-to-b from-surface to-rose-950/10 hover:border-rose-500/40">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="text-rose-400" size={20} />
                  <h3 className="font-semibold text-lg">Why This Might Fail</h3>
                </div>
                <ul className="space-y-3">
                  {result.why_it_might_fail.map((risk, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                      <ArrowRight className="shrink-0 mt-0.5 text-rose-500" size={16} />
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Success Factors */}
              <div className="card !p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Crosshair className="text-blue-400" size={20} />
                  <h3 className="font-semibold text-lg">Key Success Factors</h3>
                </div>
                <ul className="space-y-3">
                  {result.key_success_factors.map((factor, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Kill Risks */}
              <div className="card !p-5 border-red-500/30 bg-red-950/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Skull size={100} />
                </div>
                <div className="flex items-center gap-2 mb-4 relative z-10">
                  <Skull className="text-red-500" size={20} />
                  <h3 className="font-bold text-lg text-red-200">Kill Risks (Brutal Truths)</h3>
                </div>
                <ul className="space-y-3 relative z-10">
                  {result.kill_risks.map((risk, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-red-200/80 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Market Gaps & Differentiation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card !p-5 border-amber-500/20 bg-gradient-to-br from-surface to-amber-900/10">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="text-amber-400" size={20} />
                  <h3 className="font-semibold text-lg">Identified Market Gaps</h3>
                </div>
                <div className="space-y-4">
                  {result.identified_market_gaps.map((gap, idx) => (
                    <div key={idx} className="p-3 bg-slate-900/50 rounded-lg border border-amber-500/10">
                      <h4 className="font-semibold text-amber-300 mb-1 text-sm">{gap.gap}</h4>
                      <p className="text-xs text-textMuted">{gap.monetization}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card !p-5 border-purple-500/20 bg-gradient-to-br from-surface to-purple-900/10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="text-purple-400" size={20} />
                  <h3 className="font-semibold text-lg">Differentiation Ideas</h3>
                </div>
                <ul className="space-y-3">
                  {result.differentiation_ideas.map((idea, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></div>
                      <span>{idea}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Target Customer & Pivot Direction */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card !p-5 border-blue-500/20 bg-gradient-to-br from-surface to-blue-900/10">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="text-blue-400" size={20} />
                  <h3 className="font-semibold text-lg">Target Customer Definition</h3>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-textMuted text-xs uppercase tracking-wider font-semibold">Primary Segment</span>
                    <p className="text-slate-200 mt-1">{result.target_customer.primary_user_segment}</p>
                  </div>
                  <div>
                    <span className="text-textMuted text-xs uppercase tracking-wider font-semibold">Core Problem</span>
                    <p className="text-slate-200 mt-1">{result.target_customer.core_problem}</p>
                  </div>
                  <div>
                    <span className="text-textMuted text-xs uppercase tracking-wider font-semibold">Why Choose This</span>
                    <p className="text-slate-200 mt-1">{result.target_customer.why_choose_this}</p>
                  </div>
                </div>
              </div>

              {result.pivot_direction && (
                <div className="card !p-5 border-emerald-500/20 bg-gradient-to-br from-surface to-emerald-900/10">
                  <div className="flex items-center gap-2 mb-4">
                    <RefreshCcw className="text-emerald-400" size={20} />
                    <h3 className="font-semibold text-lg">Recommended Pivot</h3>
                  </div>
                  <p className="text-sm text-emerald-100/90 leading-relaxed">
                    {result.pivot_direction}
                  </p>
                </div>
              )}
            </div>

            {/* Next Steps */}
            <div className="card border-primary/20 bg-gradient-to-r from-surface to-primary/5">
              <div className="flex items-center gap-2 mb-4">
                <ListTodo className="text-primary" size={20} />
                <h3 className="font-bold text-lg">Immediate Next Steps</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.next_steps.map((step, idx) => (
                  <div key={idx} className="flex gap-3 p-4 bg-slate-900/50 rounded-xl border border-white/5">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-slate-300">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Startups */}
            <div className="card">
              <div className="flex items-center gap-2 mb-6">
                <Layers className="text-slate-400" size={20} />
                <h3 className="text-xl font-semibold">Reference Data</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.similar_startups.map((startup, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/30 rounded-lg border border-borderLight/30">
                    <h4 className="font-semibold text-slate-300 mb-1">{startup.name}</h4>
                    <p className="text-xs text-textMuted">{startup.description}</p>
                  </div>
                ))}
                {result.similar_startups.length === 0 && (
                  <p className="text-textMuted text-sm">No reference data found.</p>
                )}
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default App;
