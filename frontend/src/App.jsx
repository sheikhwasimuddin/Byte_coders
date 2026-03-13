import { useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import { Bug, Download, Play, Shield, Trash2, Upload, Zap } from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

const API_BASE_URL = "http://localhost:5000";

const SAMPLE_CODES = [
  {
    name: "Python Buggy",
    language: "python",
    code: `def process(nums):
    total = 0
    for i in range(len(nums)):
        for j in range(len(nums)):
            total += nums[i] * nums[j]
    user_input = input("code > ")
    eval(user_input)
    return total

print(process([1,2,3]))`,
  },
  {
    name: "JS Logic Risk",
    language: "javascript",
    code: `function run(data) {
  let i = 0;
  while (true) {
    if (Math.random() > 0.999) break;
    i++;
  }
  return data.name.toUpperCase();
}`,
  },
];

function detectLanguageFromName(name) {
  const ext = name.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "js":
    case "jsx":
      return "javascript";
    case "ts":
    case "tsx":
      return "typescript";
    case "java":
      return "java";
    case "cpp":
      return "cpp";
    case "c":
      return "c";
    default:
      return "python";
  }
}

function clampToPercent(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function extractPylintScore(report) {
  const match = report.match(/rated at\s+(-?\d+(?:\.\d+)?)\/10/i);
  if (!match) {
    return null;
  }
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
}

function extractBanditSeverityCounts(report) {
  const readCount = (label) => {
    const match = report.match(new RegExp(`${label}\\s*:\\s*(\\d+)`, "i"));
    return match ? Number(match[1]) : 0;
  };

  const low = readCount("Low");
  const medium = readCount("Medium");
  const high = readCount("High");
  const issueBlocks = (report.match(/^>>\s*Issue:/gim) || []).length;
  const total = issueBlocks || low + medium + high;

  return { low, medium, high, total };
}

function App() {
  const [code, setCode] = useState(SAMPLE_CODES[0].code);
  const [language, setLanguage] = useState("python");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");

  const suggestionList = useMemo(() => result?.ai_review?.suggestions || [], [result]);

  const quickStats = useMemo(() => {
    const pylint = result?.pylint || "";
    const bandit = result?.bandit || "";
    const currentLanguage = (result?.language || language || "java").toLowerCase();
    const pylintScore = extractPylintScore(pylint);
    const banditCounts = extractBanditSeverityCounts(bandit);
    const hasNoOutputMessage = /No output generated\./i.test(pylint);

    const codeHealth = hasNoOutputMessage
      ? 100
      : pylintScore === null
        ? null
        : currentLanguage === "java" || currentLanguage === "c"
          ? clampToPercent(pylintScore * 10)
          : clampToPercent(100 - pylintScore * 10);

    const securityBenchmark = clampToPercent(
      100 - (banditCounts.low * 8 + banditCounts.medium * 18 + banditCounts.high * 30)
    );

    return {
      pylintScore,
      codeHealth,
      pylintWarnings: (pylint.match(/warning|error|refactor|convention/gi) || []).length,
      securityFlags: banditCounts.total,
      securityLow: banditCounts.low,
      securityMedium: banditCounts.medium,
      securityHigh: banditCounts.high,
      securityBenchmark,
      suggestions: suggestionList.length,
    };
  }, [result, suggestionList.length, language]);

  const radarData = useMemo(() => {
    if (!result) {
      return [
        { metric: "Maintainability", value: 0 },
        { metric: "Security", value: 0 },
        { metric: "Performance", value: 0 },
        { metric: "Readability", value: 0 },
        { metric: "Reliability", value: 0 },
        { metric: "AI Confidence", value: 0 },
      ];
    }

    const complexity = Number(result?.ai_review?.complexity_score || 0);
    const pylintScore = quickStats.pylintScore ?? 0;
    const pylintWarnings = quickStats.pylintWarnings;
    const securityFlags = quickStats.securityFlags;
    const suggestions = suggestionList.length;

    const maintainability = clampToPercent(100 - pylintScore * 10 - pylintWarnings * 3);
    const security = clampToPercent(quickStats.securityBenchmark);
    const performance = clampToPercent(86 - complexity * 4 - suggestions * 3);
    const readability = clampToPercent(88 - pylintWarnings * 4 - suggestions * 2);
    const reliability = clampToPercent(90 - (pylintWarnings + securityFlags) * 4 - complexity * 2);
    const aiConfidence = clampToPercent(100 - complexity * 8);

    return [
      { metric: "Maintainability", value: maintainability },
      { metric: "Security", value: security },
      { metric: "Performance", value: performance },
      { metric: "Readability", value: readability },
      { metric: "Reliability", value: reliability },
      { metric: "AI Confidence", value: aiConfidence },
    ];
  }, [
    result,
    quickStats.pylintScore,
    quickStats.pylintWarnings,
    quickStats.securityFlags,
    quickStats.securityBenchmark,
    suggestionList.length,
  ]);

  const onReview = async (event) => {
    if (event) {
      event.preventDefault();
    }

    setError("");
    setResult(null);

    if (!code.trim()) {
      setError("Please paste code before analysis.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Review failed. Please try again.");
      }
      setResult(data);
      setActiveTab("Overview");
    } catch (reviewError) {
      setError(reviewError.message || "Unexpected error while reviewing code.");
    } finally {
      setLoading(false);
    }
  };

  const onUploadFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const content = await file.text();
    setCode(content);
    setLanguage(detectLanguageFromName(file.name));
    setResult(null);
  };

  const onExport = () => {
    if (!result) {
      return;
    }
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analysis-report.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background text-slate-200">
      <div className="fixed left-[-80px] top-24 h-72 w-72 rounded-full bg-primary-500/20 blur-[90px]" />
      <div className="fixed bottom-16 right-[-60px] h-72 w-72 rounded-full bg-accent-500/20 blur-[90px]" />

      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-[94%] max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary-500/10 p-2">
              <Bug className="h-6 w-6 text-primary-500" />
            </div>
            <span className="text-xl font-bold tracking-tight">BugSense AI</span>
          </div>

          <button
            onClick={onReview}
            disabled={loading}
            className="btn-primary inline-flex items-center gap-2 text-sm"
          >
            <Play className="h-4 w-4" />
            {loading ? "Analyzing" : "Analyze Code"}
          </button>
        </div>
      </nav>

      <main className="mx-auto w-[94%] max-w-7xl py-8">
        <section className="glass-card mb-6 animate-fade-in p-8">
          <p className="mb-4 inline-flex rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-300">
            Deep Code Reviewer
          </p>
          <h1 className="mb-4 text-4xl font-extrabold leading-tight md:text-6xl">
            Secure, Fast, and Clean
            <span className="gradient-text"> AI Code Analysis</span>
          </h1>
          <p className="max-w-3xl text-slate-400">
            This dashboard combines static checks, security scanning, and transformer-based reasoning to
            uncover bugs before production.
          </p>
        </section>

        <div className="flex flex-col gap-8 lg:flex-row">
          <section className="glass-card lg:w-7/12 p-6">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-400">Language</label>
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none"
                >
                  <option value="python">Python</option>
                  
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="c">C</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-400">Import File</label>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm hover:bg-slate-800">
                  <Upload className="h-4 w-4" />
                  Upload
                  <input type="file" className="hidden" onChange={onUploadFile} />
                </label>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-400">Samples</label>
                <div className="flex gap-2">
                  {SAMPLE_CODES.map((sample) => (
                    <button
                      key={sample.name}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium hover:bg-slate-800"
                      onClick={() => {
                        setCode(sample.code);
                        setLanguage(sample.language);
                        setResult(null);
                      }}
                    >
                      {sample.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-700 bg-[#1e1e1e]">
              <Editor
                height="500px"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  padding: { top: 16 },
                }}
              />
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setCode("");
                  setResult(null);
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm hover:bg-slate-800"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </button>
              <button
                onClick={onReview}
                disabled={loading}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                {loading ? "Analyzing" : "Analyze"}
              </button>
            </div>

            {error && <p className="mt-3 text-sm font-semibold text-rose-400">{error}</p>}
          </section>

          <section className="lg:w-5/12 space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-1">
              <div className="glass-card p-5">
                <p className="text-xs uppercase tracking-wider text-slate-400">Code Health</p>
                <h3 className="mt-1 text-3xl font-bold text-primary-500">
                  {quickStats.codeHealth ?? "--"}
                </h3>
              </div>
              <div className="glass-card p-5">
                <p className="text-xs uppercase tracking-wider text-slate-400">Pylint Findings</p>
                <h3 className="mt-1 text-3xl font-bold text-amber-400">{quickStats.pylintWarnings || "--"}</h3>
              </div>
              <div className="glass-card p-5">
                <p className="text-xs uppercase tracking-wider text-slate-400">Security Benchmark</p>
                <h3 className="mt-1 text-3xl font-bold text-emerald-400">
                  {quickStats.securityBenchmark}
                </h3>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Analysis Results</h2>
                <button
                  onClick={onExport}
                  disabled={!result}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  Export JSON
                </button>
              </div>

              {!result && !loading && (
                <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/30 p-10 text-center text-slate-500">
                  Analysis insights will appear here
                </div>
              )}

              {loading && (
                <div className="rounded-xl border border-slate-700 bg-slate-900/30 p-10 text-center">
                  <p className="text-primary-500">Running deep scan...</p>
                </div>
              )}

              {result && (
                <div className="space-y-4 animate-fade-in">
                  <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
                      Quality Radar
                    </h3>
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="#1e293b" />
                          <PolarAngleAxis
                            dataKey="metric"
                            tick={{ fill: "#94a3b8", fontSize: 11 }}
                          />
                          <PolarRadiusAxis
                            angle={25}
                            domain={[0, 100]}
                            tick={{ fill: "#64748b", fontSize: 10 }}
                          />
                          <Radar
                            dataKey="value"
                            stroke="#06b6d4"
                            fill="#06b6d4"
                            fillOpacity={0.35}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="flex gap-2 overflow-auto border-b border-slate-800 pb-2">
                    {[
                      ["Overview", Zap],
                      ["Pylint", Bug],
                      ["Bandit", Shield],
                    ].map(([name, Icon]) => (
                      <button
                        key={name}
                        onClick={() => setActiveTab(name)}
                        className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${
                          activeTab === name
                            ? "bg-primary-500/15 text-primary-500"
                            : "bg-slate-900 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {name}
                      </button>
                    ))}
                  </div>

                  {activeTab === "Overview" && (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-300">
                        Pylint rated at: <span className="font-bold text-cyan-400">{quickStats.pylintScore ?? "--"}/10</span>
                      </p>
                      <p className="text-sm text-slate-300">
                        Code health (inverse): <span className="font-bold text-primary-400">{quickStats.codeHealth ?? "--"}</span>
                      </p>
                      <p className="text-sm text-slate-300">
                        Security benchmark: <span className="font-bold text-emerald-400">{quickStats.securityBenchmark}</span>
                        {" "}
                        <span className="text-slate-400">
                          (H:{quickStats.securityHigh} M:{quickStats.securityMedium} L:{quickStats.securityLow})
                        </span>
                      </p>
                      
                    </div>
                  )}

                  {activeTab === "Pylint" && (
                    <pre className="max-h-[350px] overflow-auto rounded-xl border border-slate-700 bg-slate-950 p-4 text-xs text-slate-300">
                      {result.pylint}
                    </pre>
                  )}

                  {activeTab === "Bandit" && (
                    <pre className="max-h-[350px] overflow-auto rounded-xl border border-slate-700 bg-slate-950 p-4 text-xs text-slate-300">
                      {result.bandit}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
