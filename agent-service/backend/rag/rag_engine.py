"""
Retrieval-Augmented Generation (RAG) Engine for Institutional Knowledge
XYZ Engineering College Document Store & Vector Search Engine
"""

import re
import math
from typing import List, Dict, Any

INSTITUTIONAL_DOCUMENTS = [
    {
        "id": "DOC-ACAD-01",
        "title": "XYZ Engineering College Academic & Examination Regulations 2025-2026",
        "category": "Academic Regulations",
        "content": """
Section 4: Examination Regulations & Attendance Requirements
4.1 Minimum Attendance Rule: A student must maintain a minimum of 75% overall attendance in each semester to be eligible for end-semester examinations.
4.2 Condonation of Attendance: Students with attendance between 65% and 74.9% may apply for condonation on medical grounds with a valid medical certificate issued by a registered medical practitioner and payment of a condonation fee of ₹1,000.
4.3 Detention: Students whose attendance falls below 65% in a semester are detained and will not be permitted to take the end-semester examinations. They must re-register for the semester in the next academic year.
4.4 Makeup Examinations: Makeup examinations are granted strictly for students who missed regular mid-term or end-semester examinations due to officially sanctioned medical emergencies, approved sports representation, or placement drive collisions. Approval must be obtained from the Dean of Examinations and Head of Department (HOD) within 3 days of the missed exam.
4.5 Evaluation Structure: 40% Continuous Internal Evaluation (CIE) + 60% Semester End Examination (SEE). Minimum pass mark in CIE is 40% and overall 45%.
        """
    },
    {
        "id": "DOC-PLC-02",
        "title": "Campus Placement & Internship Policy Guidelines 2026",
        "category": "Placement Policy",
        "content": """
Section 2: Internship & Placement Eligibility Criteria
2.1 General Eligibility: Students eligible for campus placements and internships must have no active backlogs at the time of company registration unless explicitly permitted by the recruiting company.
2.2 Tier-1 Internship Policy (Google, Microsoft, Amazon):
- Eligible Streams: 3rd & 4th Year B.E. CSE, IT, ECE.
- Minimum CGPA: 8.00 CGPA with 0 active backlogs.
- Attendance Requirement: Minimum 75% attendance in current semester.
- Workshop Registration: Eligible students must register for pre-placement orientation workshops hosted by the Placement Cell to get interview clearances.
2.3 Dream Offer Rule: A student securing an internship with stipend > ₹75,000/month is classified as 'Dream Offer' and is locked from applying to non-dream companies.
2.4 Attendance Credit during Drives: Attendance waiver of up to 5% is granted for students participating in verified campus placement interviews and off-campus hackathon finals.
        """
    },
    {
        "id": "DOC-HST-03",
        "title": "Hostel Regulations & Student Services Handbook",
        "category": "Student Services",
        "content": """
Section 7: Hostel Guidelines & Transport Services
7.1 Curfew & Gate Passes: In-time for campus hostels is 08:30 PM for all residents. Night out passes must be submitted 24 hours in advance via the Student Portal and approved by the Warden.
7.2 Merit Scholarships: Management Merit Scholarship awards ₹25,000 per annum to top 3 rankers in each branch. Apply before September 30 with marksheet copies.
7.3 Grievances: Infrastructure, mess quality, or Wi-Fi complaints must be logged under Student Services Agent or filed at student-services@xyz.edu.in. Average resolution SLA is 48 hours.
        """
    }
]

class RAGEngine:
    def __init__(self):
        self.documents = INSTITUTIONAL_DOCUMENTS
        self.chunks = []
        self._build_index()

    def _tokenize(self, text: str) -> List[str]:
        return re.findall(r'\w+', text.lower())

    def _build_index(self):
        for doc in self.documents:
            lines = doc["content"].strip().split("\n")
            current_chunk = []
            for line in lines:
                if line.strip():
                    current_chunk.append(line.strip())
                if len(current_chunk) >= 3:
                    chunk_text = " ".join(current_chunk)
                    self.chunks.append({
                        "doc_id": doc["id"],
                        "title": doc["title"],
                        "category": doc["category"],
                        "text": chunk_text,
                        "tokens": self._tokenize(chunk_text)
                    })
                    current_chunk = []
            if current_chunk:
                chunk_text = " ".join(current_chunk)
                self.chunks.append({
                    "doc_id": doc["id"],
                    "title": doc["title"],
                    "category": doc["category"],
                    "text": chunk_text,
                    "tokens": self._tokenize(chunk_text)
                })

    def search(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        query_tokens = set(self._tokenize(query))
        if not query_tokens:
            return []

        results = []
        for chunk in self.chunks:
            chunk_tokens = set(chunk["tokens"])
            intersection = query_tokens.intersection(chunk_tokens)
            score = len(intersection) / (math.sqrt(len(query_tokens)) * math.sqrt(len(chunk_tokens)) + 1e-5)
            
            # Boost score for keyword match
            for q_tok in query_tokens:
                if len(q_tok) > 3 and q_tok in chunk["text"].lower():
                    score += 0.25

            if score > 0.05:
                results.append({
                    "doc_id": chunk["doc_id"],
                    "title": chunk["title"],
                    "category": chunk["category"],
                    "snippet": chunk["text"],
                    "relevance_score": round(score, 3)
                })

        results.sort(key=lambda x: x["relevance_score"], reverse=True)
        return results[:top_k]

rag_engine = RAGEngine()
