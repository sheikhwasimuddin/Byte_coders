import { ArrowRight, Bug, CheckCircle, Search, Shield, Terminal, Zap, Code } from "lucide-react";
import Navbar from "./Navbar";

export default function HomePage({ onNavigate, currentPath }) {
  const features = [
    { icon: Search, title: "Deep Logic Scan", desc: "Identify complex logical bugs that traditional linters miss.", color: "text-primary-400" },
    { icon: Shield, title: "Security Audit", desc: "Auto-detect vulnerability patterns and hardcoded secrets.", color: "text-accent-400" },
    { icon: Zap, title: "Performance Boost", desc: "Find expensive loops and risky bottlenecks in seconds.", color: "text-blue-400" },
    { icon: Terminal, title: "Polyglot Support", desc: "Analyze Java, Python, and C projects in one dashboard.", color: "text-emerald-400" },
    { icon: CheckCircle, title: "Smart Refactoring", desc: "Receive production-ready recommendations instantly.", color: "text-primary-300" },
    { icon: Code, title: "Custom Heuristics", desc: "Combines AI reasoning with static and security analysis.", color: "text-accent-300" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center">
      {/* Premium Gradient Orbs */}
      <div className="orb bg-primary-600 w-[500px] h-[500px] top-[-100px] left-[-150px]" />
      <div className="orb bg-accent-600 w-[600px] h-[600px] bottom-[-200px] right-[-200px] opacity-20" />
      <div className="orb bg-blue-500 w-[400px] h-[400px] top-[40%] left-[50%] -translate-x-1/2 opacity-10" />

      <Navbar 
        onNavigate={onNavigate} 
        currentPath={currentPath}
        rightElement={
          <button onClick={() => onNavigate("/analyzer")} className="btn-primary py-2 px-6">
            Launch App
            <ArrowRight className="h-4 w-4" />
          </button>
        }
      />

      {/* Main Content */}
      <main className="w-full max-w-7xl px-6 pt-40 pb-20 flex flex-col items-center flex-1">
        
        {/* Elite Hero Section */}
        <section className="text-center w-full max-w-4xl mb-24 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-2 mb-8 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <Shield className="h-4 w-4 text-primary-400" />
            <span className="text-sm font-semibold tracking-wide text-primary-300 uppercase">Enterprise Grade Analysis</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-8 text-white drop-shadow-2xl">
            Write <span className="bg-gradient-to-r from-primary-400 via-blue-400 to-accent-400 bg-clip-text text-transparent filter drop-shadow-[0_0_12px_rgba(96,165,250,0.5)]">Flawless Code</span><br/>
            With Neural Intelligence.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            BugSense AI detects logical flaws, subtle security vulnerabilities, and deep performance bottlenecks seconds before they hit production.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button onClick={() => onNavigate("/analyzer")} className="btn-primary py-4 px-8 text-lg w-full sm:w-auto">
              Start Free Analysis
              <ArrowRight className="h-5 w-5" />
            </button>
            <button className="rounded-xl border border-white/10 bg-surface/50 backdrop-blur-md px-8 py-4 font-semibold text-white hover:bg-surface/80 hover:border-white/20 transition-all shadow-glass-sm w-full sm:w-auto">
              View Architecture Matrix
            </button>
          </div>
        </section>

        {/* Feature Highlights Glass Cards */}
        <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-32 z-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {[
            { icon: Zap, title: "Instant Review", desc: "Milliseconds to scan thousands of lines of code securely." },
            { icon: Shield, title: "Zero Day Prevention", desc: "Locate potential exploit paths before deployment." },
            { icon: Code, title: "Contextual Refactoring", desc: "Get highly accurate, drop-in replacement suggestions." },
          ].map((item, idx) => (
            <article key={idx} className="glass-card p-8 group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="h-12 w-12 rounded-xl bg-surfaceHover border border-white/5 flex items-center justify-center mb-6 shadow-glass-sm group-hover:border-primary-500/30 transition-colors">
                  <item.icon className="h-6 w-6 text-primary-400 group-hover:text-primary-300 transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">{item.desc}</p>
              </div>
            </article>
          ))}
        </section>

        {/* Core Capabilities */}
        <section className="w-full mb-24 z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white drop-shadow-lg">Why Elite Teams Choose BugSense</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Engineered from the ground up to support modern secure development lifecycles.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <article key={idx} className="glass-card p-8 hover:-translate-y-1 transition-transform duration-300 group">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-surfaceHover border border-white/5 shadow-glass-sm group-hover:shadow-glow transition-all`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-slate-100">{feature.title}</h3>
                    <p className="text-slate-400 font-medium leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        
        {/* Footer CTA */}
       <section className="w-full text-center py-20 relative z-10 glass-card bg-gradient-to-t from-primary-900/20 to-transparent flex flex-col items-center justify-center">
          <h2 className="text-4xl font-extrabold mb-6 text-white">Deploy With Supreme Confidence</h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg">Join the top 1% of developers shipping highly secure, performant software globally.</p>
          <button onClick={() => onNavigate("/analyzer")} className="btn-primary py-4 px-10 text-lg shadow-accent-glow hover:shadow-glow-pulse">
            Launch Analyzer
            <ArrowRight className="h-5 w-5" />
          </button>
        </section>
      </main>
      
      {/* Simple Footer */}
      <footer className="w-full py-8 border-t border-white/5 bg-background/50 backdrop-blur-md text-center text-slate-500 font-medium text-sm relative z-10 mt-auto">
        <p>&copy; 2026 BugSense AI. Forged in the Neural Cloud.</p>
      </footer>
    </div>
  );
}
