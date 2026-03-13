import os
import re
import subprocess
import tempfile
from pathlib import Path

# Keep transformers from importing TensorFlow backends and reduce noisy logs.
os.environ.setdefault("TRANSFORMERS_NO_TF", "1")
os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "3")
os.environ.setdefault("TF_ENABLE_ONEDNN_OPTS", "0")
os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")

import torch
from flask import Flask, jsonify, request
from flask_cors import CORS
from transformers import AutoModel, AutoTokenizer

print("Loading Transformer Model...")

MODEL_NAME = "distilbert-base-uncased"
WORKSPACE_DIR = Path(__file__).resolve().parent

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModel.from_pretrained(MODEL_NAME)

print("Model Loaded Successfully!\n")

app = Flask(__name__)
CORS(app)

LANGUAGE_SUFFIX = {
    "java": ".java",
    "c": ".c",
}


def normalize_language(raw_language):
    value = (raw_language or "java").strip().lower()
    if value in {"cc", "cxx", "cpp", "c++"}:
        return "c"
    return value


def detect_java_public_type_name(code):
    match = re.search(r"\bpublic\s+(?:class|interface|enum)\s+([A-Za-z_][A-Za-z0-9_]*)", code)
    return match.group(1) if match else None


def run_command(command):
    """Run shell command and return output without raising on non-zero exit."""
    completed = subprocess.run(
        command,
        cwd=WORKSPACE_DIR,
        capture_output=True,
        text=True,
        check=False,
    )
    output = (completed.stdout or "") + ("\n" + completed.stderr if completed.stderr else "")
    return output.strip() or "No output generated."


def run_pylint(file_path):
    return run_command(["pylint", str(file_path)])


def run_bandit(file_path):
    return run_command(["bandit", str(file_path)])


def run_command_with_code(command):
    completed = subprocess.run(
        command,
        cwd=WORKSPACE_DIR,
        capture_output=True,
        text=True,
        check=False,
    )
    output = (completed.stdout or "") + ("\n" + completed.stderr if completed.stderr else "")
    return completed.returncode, (output.strip() or "No output generated.")


def format_static_report(language, output, return_code):
    warning_count = len(re.findall(r"\bwarning\b", output, flags=re.IGNORECASE))
    error_count = len(re.findall(r"\berror\b", output, flags=re.IGNORECASE))

    # Java/C rule: no compiler errors means full score; errors reduce health.
    if error_count == 0:
        score = 10.0
    else:
        penalty = error_count * 2 + warning_count * 0.25
        score = max(0.0, 10.0 - penalty)

    header = [
        f"STATIC ANALYSIS ({language.upper()})",
        "",
        f"Warnings: {warning_count}",
        f"Errors: {error_count}",
        f"Exit code: {return_code}",
        "",
        f"Your code has been rated at {score:.2f}/10",
        "",
        "Compiler output:",
        output,
    ]
    return "\n".join(header)


def run_heuristic_security_scan(code, language):
    """Simple regex-based security checks for non-Python languages."""
    rules = {
        "java": [
            (r"\bRuntime\s*\.\s*getRuntime\s*\(\)\s*\.\s*exec\s*\(", "HIGH", "Use of Runtime.exec may allow command injection."),
            (r"\bProcessBuilder\s*\(", "HIGH", "ProcessBuilder usage should validate all command arguments."),
            (r"\bSystem\.setProperty\s*\(\s*\"javax\.net\.ssl\.", "MEDIUM", "TLS/SSL runtime property changes may weaken transport security."),
            (r'\bDriverManager\.getConnection\s*\(\s*"jdbc:[^"]+",\s*"[^"]+",\s*"[^"]+"', "MEDIUM", "Hardcoded database credentials detected."),
            (r'\b(password|secret|api[_-]?key|token)\b\s*=\s*"[^"]+"', "LOW", "Possible hardcoded secret string."),
        ],
        "c": [
            (r"\b(system|popen)\s*\(", "HIGH", "Shell execution detected; validate input and avoid command injection."),
            (r"\b(strcpy|strcat|gets|sprintf)\s*\(", "HIGH", "Unsafe string API may cause buffer overflow."),
            (r"\bscanf\s*\(\s*\"%s", "MEDIUM", "Unbounded scanf(%s) may overflow buffers."),
            (r'\b(password|secret|api[_-]?key|token)\b\s*=\s*"[^"]+"', "LOW", "Possible hardcoded secret string."),
        ],
        "cpp": [
            (r"\b(system|popen)\s*\(", "HIGH", "Shell execution detected; validate input and avoid command injection."),
            (r"\b(strcpy|strcat|gets|sprintf)\s*\(", "HIGH", "Unsafe string API may cause buffer overflow."),
            (r"\bstd::system\s*\(", "HIGH", "std::system usage is risky with user-controlled input."),
            (r'\b(password|secret|api[_-]?key|token)\b\s*=\s*"[^"]+"', "LOW", "Possible hardcoded secret string."),
        ],
    }

    selected = rules.get(language, [])
    findings = []
    counts = {"LOW": 0, "MEDIUM": 0, "HIGH": 0}

    for pattern, severity, message in selected:
        if re.search(pattern, code, flags=re.IGNORECASE):
            counts[severity] += 1
            findings.append((severity, message))

    lines = [
        f"Security Heuristic Scan ({language.upper()})",
        "",
        f"Low: {counts['LOW']}",
        f"Medium: {counts['MEDIUM']}",
        f"High: {counts['HIGH']}",
        "",
        "Issues:",
    ]

    if not findings:
        lines.append("No obvious security risks detected by heuristic rules.")
    else:
        for severity, message in findings:
            lines.append(f"- [{severity}] {message}")

    return "\n".join(lines)


def run_static_analysis(file_path, language):
    if language == "java":
        return_code, output = run_command_with_code(["javac", "-Xlint", str(file_path)])
        return format_static_report(language, output, return_code)
    if language == "c":
        with tempfile.TemporaryDirectory() as build_dir:
            output_file = Path(build_dir) / "temp_exec"
            return_code, output = run_command_with_code(["gcc", "-Wall", str(file_path), "-o", str(output_file)])
            return format_static_report(language, output, return_code)
    return f"Static analysis not supported for '{language}'."


def run_security_scan(file_path, language, code):
    if language in {"java", "c"}:
        return run_heuristic_security_scan(code, language)
    return f"Security scan currently not supported for '{language}'."


def ai_review(code, language):
    prompt = f"""
Analyze the following {language} code and identify bugs,
inefficient logic, and possible security risks.

Code:
{code}
"""

    inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=512)
    outputs = model(**inputs)
    embedding = outputs.last_hidden_state.mean(dim=1)
    score = torch.norm(embedding).item()

    return {
        "title": f"AI CODE REVIEW - {language.upper()}",
        "summary": "Transformer analysis completed.",
        "complexity_score": round(score, 2),
        "suggestions": [
            "Review loops for inefficiency.",
            "Validate user input properly.",
            "Avoid unsafe functions like eval() or direct shell/system calls.",
        ],
    }


@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


@app.post("/api/review")
def review_code():
    payload = request.get_json(silent=True) or {}
    code = payload.get("code", "")
    language = normalize_language(payload.get("language", "python"))

    if not isinstance(code, str) or not code.strip():
        return jsonify({"error": "Please provide source code in the 'code' field."}), 400

    if language not in LANGUAGE_SUFFIX:
        return jsonify(
            {
                "error": "Unsupported language. Supported values: java, c.",
            }
        ), 400

    temp_path = None
    temp_dir = None

    if language == "java":
        # javac requires the filename to match the public type name.
        temp_dir = tempfile.TemporaryDirectory()
        public_type = detect_java_public_type_name(code)
        java_file_name = f"{public_type}.java" if public_type else "Main.java"
        temp_path = Path(temp_dir.name) / java_file_name
        temp_path.write_text(code, encoding="utf-8")
    else:
        suffix = LANGUAGE_SUFFIX[language]
        with tempfile.NamedTemporaryFile(mode="w", suffix=suffix, delete=False, encoding="utf-8") as temp_file:
            temp_file.write(code)
            temp_path = Path(temp_file.name)

    try:
        static_report = run_static_analysis(temp_path, language)
        security_report = run_security_scan(temp_path, language, code)
    finally:
        if temp_path is not None and temp_path.exists():
            temp_path.unlink(missing_ok=True)
        if temp_dir is not None:
            temp_dir.cleanup()

    ai_report = ai_review(code, language)

    return jsonify(
        {
            "language": language,
            "static_analysis": static_report,
            "security_analysis": security_report,
            # Keep existing keys for frontend compatibility.
            "pylint": static_report,
            "bandit": security_report,
            "ai_review": ai_report,
        }
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False, use_reloader=False)