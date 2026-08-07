"""
FastAPI Server Entrypoint for Smart Campus Multi-Agent AI System
XYZ Engineering College
"""

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any

from backend.agents.orchestrator import orchestrator
from backend.rag.rag_engine import rag_engine
from backend.data.mock_db import STUDENT_PROFILES, CAMPUS_EVENTS, INTERNSHIP_LISTINGS, SCHOLARSHIPS, TRANSPORT_ROUTES, CAMPUS_FAQS, GRIEVANCE_TICKETS

app = FastAPI(
    title="Smart Campus Multi-Agent AI System API",
    description="AgentX Hackathon 2026 - XYZ Engineering College",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    query: str
    student_id: Optional[str] = "S101"

class HITLResponseRequest(BaseModel):
    draft_id: str
    action: str  # 'approve' or 'reject'
    modified_body: Optional[str] = None

class RAGQueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = 3

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "Smart Campus Multi-Agent AI System",
        "institution": "XYZ Engineering College",
        "version": "1.0.0"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "agents_loaded": 7, "rag_documents": len(rag_engine.documents), "memory_entries": len(orchestrator.conversation_memory)}

@app.get("/api/memory")
def get_memory():
    return {"memory_entries": orchestrator.conversation_memory}

@app.post("/api/chat")
def process_chat(req: ChatRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    
    result = orchestrator.process_query(user_query=req.query, student_id=req.student_id)
    return result

@app.post("/api/rag/search")
def rag_search(req: RAGQueryRequest):
    results = rag_engine.search(query=req.query, top_k=req.top_k)
    return {"query": req.query, "results": results}

@app.get("/api/students")
def get_students():
    return {"students": list(STUDENT_PROFILES.values())}

@app.get("/api/students/{student_id}")
def get_student_profile(student_id: str):
    profile = STUDENT_PROFILES.get(student_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return profile

@app.post("/api/hitl/respond")
def hitl_respond(req: HITLResponseRequest):
    for ticket in GRIEVANCE_TICKETS:
        if ticket.get("ticket_id") == req.draft_id:
            ticket["status"] = "submitted" if req.action == "approve" else "cancelled"
    if req.action == "approve":
        return {
            "status": "approved",
            "message": f"Email {req.draft_id} approved and dispatched successfully to recipient.",
            "timestamp": "2026-08-07 14:02:00"
        }
    else:
        return {
            "status": "rejected",
            "message": f"Draft {req.draft_id} rejected by user. Cancelled transmission.",
            "timestamp": "2026-08-07 14:02:00"
        }

@app.get("/api/events")
def get_events():
    return {"events": CAMPUS_EVENTS}

@app.get("/api/internships")
def get_internships():
    return {"internships": INTERNSHIP_LISTINGS}

@app.get("/api/scholarships")
def get_scholarships():
    return {"scholarships": SCHOLARSHIPS}

@app.get("/api/transport")
def get_transport():
    return {"routes": TRANSPORT_ROUTES}

@app.get("/api/faqs")
def get_faqs():
    return {"faqs": CAMPUS_FAQS}

@app.get("/api/grievances")
def get_grievances():
    return {"grievances": GRIEVANCE_TICKETS}

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
