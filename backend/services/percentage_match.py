import openai
from flask import Flask
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)


@app.route("match-resume-job", method=["POST"])
def percentage_match(job_text, resume_text):
    prompt = f"""
    What's the percentage patching between this resume and this job description

    Resume: {job_text, resume_text}
    """
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",  # Specify the model
            messages=[{"role": "user", "content": prompt}],
            max_tokens=2000,  # Adjust based on expected response size
            temperature=0.5,  # Adjust for less random responses
        )
        return response["choices"][0]["message"]["content"]
    except Exception as e:
        print("Error during API call:", e)
        return None


if __name__ == "__main__":
    openai.api_key = os.environ["API_KEY"]
    openai.organization = os.environ["ORGANIZATION_ID"]

    app.run(debug=True, port=8080)
