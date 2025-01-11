import pdfplumber
import spacy
from spacy.matcher import Matcher
import shutil
import re


def parse_dynamic_section_content(name, content):
    """
    This function dynamically parses the content based on detected section name.
    """
    date_pattern = r'\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}'

    if "experience" in section_name.lower():
        # Dynamically parse work experience (position, company, dates, responsibilities)
        jobs = re.split(r'\s{2,}', content)  # Split on double spaces (common in resumes)
        job_entries = []
        for job in jobs:
            # Use regex to capture position, company, and dates
            position_company = re.search(r'(.+?) at (.+?)(?=\b(?:Jan|Feb|Mar)\b|\d{4})', job)
            dates = re.findall(date_pattern, job)
            responsibilities = re.findall(r'•\s(.*)', job)  # Bullet points for responsibilities

            job_entries.append({
                "Position": position_company.group(1).strip() if position_company else 'N/A',
                "Company": position_company.group(2).strip() if position_company else 'N/A',
                "Dates": ' - '.join(dates) if dates else 'N/A',
                "Responsibilities": responsibilities if responsibilities else 'N/A'
            })
        return job_entries

    elif "education" in section_name.lower():
        # Parse education section
        degree = re.search(r'(Bachelor|Master|PhD|Diploma|Certificate)[^,]*', content)
        university = re.search(r'(University|Institute|College)[^,]*', content)
        dates = re.findall(date_pattern, content)
        relevant_courses = re.search(r'Relevant Courses[^:]*: (.*)', content)

        return {
            "Degree": degree.group(0).strip() if degree else 'N/A',
            "University": university.group(0).strip() if university else 'N/A',
            "Dates": ' - '.join(dates) if dates else 'N/A',
            "Relevant Courses": relevant_courses.group(1).strip() if relevant_courses else 'N/A'
        }

    elif "skills" in section_name.lower():
        # Parse skills section
        skills = re.split(r'•', content)  # Bullet points typically denote skills
        return [skill.strip() for skill in skills if skill.strip()]

    # Catch-all for any other sections
    return content


with pdfplumber.open("/Users/jaredmatthews/McGill/McGill/McGill Fall 2024/ECSE 437/Applicant%20Tracking%20System/backend/docs/Jared Matthews CV.pdf") as pdf:
    extracted_text = pdf.pages[0].extract_text()
    extracted_text = extracted_text.replace('\n', ' ').replace('\r', '').replace('\xa0', ' ').strip()


# Load pre-trained NLP model
nlp = spacy.load("en_core_web_sm")


# Define common section headers
matcher = Matcher(nlp.vocab)

pattern = [
    [{"LOWER": "experience"}],
    [{"LOWER": "education"}],
    [{"LOWER": "skills"}]
   ]
matcher.add("RESUME_SECTION", pattern)

# Process the extracted text
# doc = nlp(dummy_text)
doc = nlp(extracted_text)

matches = matcher(doc)

# Sort matches by start index (ensure they are in order of appearance)
matches = sorted(matches, key=lambda x: x[1])

cli_width = shutil.get_terminal_size().columns

# Print the results
section_content = {}
for i, match in enumerate(matches):
    match_id, start, end = match
    span = doc[start:end]
    section_name = span.text
    # print(f"{section_name}".center(cli_width, "-"))

    # Determine where the current section ends (next match or end of doc)
    if i + 1 < len(matches):
        next_start = matches[i + 1][1]
    else:
        next_start = len(doc)  # End of document if no more matches

    # Extract the content between the current match and the next match
    section_c = doc[end:next_start].text
    # print(f"{section_content}".center(cli_width))
    # Call a function to dynamically parse the content
    section_content[section_name] = parse_dynamic_section_content(section_name, section_c)

# Output the parsed sections and their details
for section, details in section_content.items():
    print(f"Section: {section}")
    print(f"Details: {details}\n")
