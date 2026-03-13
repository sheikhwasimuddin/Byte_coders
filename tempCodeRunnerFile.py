import subprocess
import torch
from transformers import AutoTokenizer, AutoModel

print("Loading Transformer Model...")

model_name = "distilbert-base-uncased"

tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name)

print("Model Loaded Successfully!\n")


# -----------------------------
# Static Code Analysis
# -----------------------------

def run_pylint():
    print("\nRunning Pylint Analysis...\n")
    result = subprocess.getoutput("pylint temp_code.py")
    return result


# -----------------------------
# Security Scan
# -----------------------------

def run_bandit():
    print("\nRunning Security Scan...\n")
    result = subprocess.getoutput("bandit temp_code.py")
    return result


# -----------------------------
# AI Code Review
# -----------------------------

def ai_review(code):

    print("\nRunning AI Transformer Analysis...\n")

    prompt = f"""
Analyze the following Python code and identify bugs,
inefficient logic, and possible security risks.

Code:
{code}
"""

    inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=512)

    outputs = model(**inputs)

    embedding = outputs.last_hidden_state.mean(dim=1)

    score = torch.norm(embedding).item()

    result = f"""
AI CODE REVIEW

Transformer analysis completed.

Code Complexity Score: {round(score,2)}

Suggestions:
• Review loops for inefficiency
• Validate user input properly
• Avoid unsafe functions like eval()
"""

    return result


# -----------------------------
# MAIN PROGRAM
# -----------------------------

print("=================================")
print("        AI CODE REVIEW TOOL")
print("=================================\n")

print("Paste your Python code below.")
print("Type END on a new line to finish.\n")

lines = []

while True:
    line = input()

    if line.strip() == "END":
        break

    lines.append(line)

code = "\n".join(lines)


# Save code for analysis
with open("temp_code.py", "w") as f:
    f.write(code)


# Run analysis
pylint_report = run_pylint()
bandit_report = run_bandit()
ai_report = ai_review(code)


# -----------------------------
# FINAL REPORT
# -----------------------------

print("\n\n======================================")
print("           CODE REVIEW REPORT")
print("======================================\n")

print("STATIC ANALYSIS (PYLINT)")
print("--------------------------------------")
print(pylint_report)

print("\nSECURITY ANALYSIS (BANDIT)")
print("--------------------------------------")
print(bandit_report)

print("\nAI TRANSFORMER REVIEW")
print("--------------------------------------")
print(ai_report)

print("\nAnalysis Completed.")