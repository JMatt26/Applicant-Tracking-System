import os
import openai
import pdfplumber
from flask import Flask, request, jsonify
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)


def extract_text(file_path):
    with pdfplumber.open(file_path) as pdf:
        extracted_text = pdf.pages[0].extract_text()
        extracted_text = (
            extracted_text.replace("\n", " ")
            .replace("\r", "")
            .replace("\xa0", " ")
            .strip()
        )
        return extracted_text


def parse_resume_with_gpt(resume_text):
    prompt = f"""
    Parse the given resume into its various sections and return it in json format
    
    Resume: {resume_text}
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


@app.route("/process-resume", methods=["POST"])
def process_resume_endpoint():
    """
    Flask endpoint to process an uploaded resume file from the frontend.
    """
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded."}), 400

    file = request.files["file"]

    # Ensure the uploaded file is a PDF
    if not file.filename.endswith(".pdf"):
        return jsonify({"error": "Invalid file format. Please upload a PDF."}), 400

    try:
        # Extract text directly from the uploaded file
        resume_text = extract_text(file)
        if not resume_text:
            return jsonify(
                {"error": "Failed to extract text from the uploaded PDF."}
            ), 500

        # Parse the resume using OpenAI API
        parsed_sections = parse_resume_with_gpt(resume_text)
        if not parsed_sections:
            return jsonify({"error": "Failed to parse resume with OpenAI API."}), 500

        return {"parsed_sections": parsed_sections}, 200

    except Exception as e:
        print(f"Error processing resume: {e}")
        return jsonify({"error": "An error occurred while processing the resume."}), 500


def parse_job_with_gpt(job_text):
    prompt = f"""
    Parse the given job description, extract its pertinent information regarding a candidate, and return it in json format

    Resume: {job_text}
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


@app.route("/process-job", methods=["POST"])
def process_job_endpoint():
    """
    Flask endpoint to process an uploaded job description file from the frontend.
    """
    if "job" not in request.files:
        return jsonify({"error": "No job file uploaded."}), 400

    file = request.files["job"]  # Access the file with key 'job'

    # Ensure the uploaded file is a PDF
    if not file.filename.endswith(".pdf"):
        return jsonify({"error": "Invalid file format. Please upload a PDF."}), 400

    try:
        # Extract text directly from the uploaded file
        job_text = extract_text(file)
        if not job_text:
            return jsonify(
                {"error": "Failed to extract text from the uploaded PDF."}
            ), 500

        # Parse the job description using OpenAI API
        parsed_sections = parse_resume_with_gpt(
            job_text
        )  # Assuming this method works for job descriptions too
        if not parsed_sections:
            return jsonify(
                {"error": "Failed to parse job description with OpenAI API."}
            ), 500

        return {"parsed_sections": parsed_sections}, 200

    except Exception as e:
        print(f"Error processing job file: {e}")
        return jsonify(
            {"error": "An error occurred while processing the job file."}
        ), 500


if __name__ == "__main__":
    openai.api_key = os.environ["API_KEY"]
    openai.organization = os.environ["ORGANIZATION_ID"]

    app.run(debug=True, port=8080)
