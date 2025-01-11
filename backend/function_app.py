import azure.functions as func
import json
import openai
import os
import pdfplumber
import requests
import io
from dotenv import load_dotenv

load_dotenv()

app = func.FunctionApp()
openai.api_key = os.environ["API_KEY"]
openai.organization = os.environ["ORGANIZATION_ID"]

def extract_text(file_content):
    with pdfplumber.open(io.BytesIO(file_content)) as pdf:
        extracted_text = pdf.pages[0].extract_text()
        extracted_text = extracted_text.replace('\n', ' ').replace('\r', '').replace('\xa0', ' ').strip()
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
        return response['choices'][0]['message']['content']
    except Exception as e:
        print("Error during API call:", e)
        return None

@app.route(route="process-resume", auth_level=func.AuthLevel.ANONYMOUS, methods=["POST"])
def process_resume_endpoint(req: func.HttpRequest) -> func.HttpResponse:
    """
    Azure Function endpoint to process a resume file from a provided URL.
    """
    # Get the file URL from the query parameters
    file_url = req.params.get("file")
    if not file_url:
        return func.HttpResponse(
            '{"error": "No file URL provided."}', 
            status_code=400,
            mimetype="application/json"
        )

    try:
        # Fetch the file from the provided URL
        response = requests.get(file_url)
        response.raise_for_status()  # Raise an error for bad responses

        # Extract text directly from the downloaded PDF content
        resume_text = extract_text(response.content)
        if not resume_text:
            return func.HttpResponse(
                '{"error": "Failed to extract text from the downloaded PDF."}', 
                status_code=500,
                mimetype="application/json"
            )

        # Parse the resume using OpenAI API
        parsed_sections = parse_resume_with_gpt(resume_text)
        if not parsed_sections:
            return func.HttpResponse(
                '{"error": "Failed to parse resume with OpenAI API."}', 
                status_code=500,
                mimetype="application/json"
            )

        return func.HttpResponse(
            json.dumps({"parsed_sections": parsed_sections}), 
            status_code=200,
            mimetype="application/json"
        )

    except Exception as e:
        print(f"Error processing resume: {e}")
        return func.HttpResponse(
            '{"error": "An error occurred while processing the resume."}', 
            status_code=500,
            mimetype="application/json"
        )

@app.route(route="process-job", auth_level=func.AuthLevel.ANONYMOUS, methods=["POST"])
def process_job_endpoint(req: func.HttpRequest) -> func.HttpResponse:
    """
    Azure Function endpoint to process a job description file from a provided URL.
    """
    # Get the file URL from the query parameters
    file_url = req.params.get("file")
    if not file_url:
        return func.HttpResponse(
            '{"error": "No file URL provided."}', 
            status_code=400,
            mimetype="application/json"
        )

    try:
        # Fetch the file from the provided URL
        response = requests.get(file_url)
        response.raise_for_status()  # Raise an error for bad responses

        # Extract text directly from the downloaded PDF content
        job_text = extract_text(response.content)
        if not job_text:
            return func.HttpResponse(
                '{"error": "Failed to extract text from the downloaded PDF."}', 
                status_code=500,
                mimetype="application/json"
            )

        # Parse the job description using OpenAI API
        parsed_sections = parse_resume_with_gpt(job_text)  # Assuming this method works for job descriptions too
        if not parsed_sections:
            return func.HttpResponse(
                '{"error": "Failed to parse job description with OpenAI API."}', 
                status_code=500,
                mimetype="application/json"
            )

        return func.HttpResponse(
            json.dumps({"parsed_sections": parsed_sections}), 
            status_code=200,
            mimetype="application/json"
        )

    except Exception as e:
        print(f"Error processing job file: {e}")
        return func.HttpResponse(
            '{"error": "An error occurred while processing the job file."}', 
            status_code=500,
            mimetype="application/json"
        )

@app.route(route="match-resume-job", auth_level=func.AuthLevel.ANONYMOUS, methods=["POST"])
def percentage_match(req: func.HttpRequest) -> func.HttpResponse:
    # Extract job_text and resume_text from the request body
    req_body = req.get_json()
    job_text = req_body.get("job_text")
    resume_text = req_body.get("resume_text")

    if not job_text or not resume_text:
        return func.HttpResponse(
            '{"error": "Both job_text and resume_text must be provided."}', 
            status_code=400,
            mimetype="application/json"
        )

    prompt = f"""
    What's the percentage matching between this resume and this job description

    Resume: {resume_text}
    Job Description: {job_text}
    """
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",  # Specify the model
            messages=[{"role": "user", "content": prompt}],
            max_tokens=2000,  # Adjust based on expected response size
            temperature=0.5,  # Adjust for less random responses
        )
        return func.HttpResponse(
            response['choices'][0]['message']['content'],
            status_code=200,
            mimetype="application/json"
        )
    except Exception as e:
        print("Error during API call:", e)
        return func.HttpResponse(
            '{"error": "An error occurred during the API call."}', 
            status_code=500,
            mimetype="application/json"
        )
