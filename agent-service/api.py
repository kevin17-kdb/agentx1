"""
Zero-Dependency Agent Service for Smart Campus Multi-Agent System
Exposes the Python agents + RAG + mock data as a JSON REST API.
Called by the Express gateway (server/). Port 8100.

Agent structure and data source are UNCHANGED from the original HTML demo â€”
this is only an HTTP wrapper around backend/orchestrator, backend/rag, backend/data.
"""

import http.server
import socketserver
import json
import os
import sys
import urllib.parse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.agents.orchestrator import orchestrator
from backend.rag.rag_engine import rag_engine
from backend.data.mock_db import (
    STUDENT_PROFILES, CAMPUS_EVENTS, INTERNSHIP_LISTINGS, SCHOLARSHIPS,
    TRANSPORT_ROUTES, CAMPUS_FAQS, GRIEVANCE_TICKETS, ACTION_LOG, log_action
)

# Force UTF-8 output so rupee/emoji never become mojibake in the console
if hasattr(sys.stdout, "reconfigure") and hasattr(sys.stderr, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

PORT = 8100


class AgentServiceHandler(http.server.BaseHTTPRequestHandler):
    server_version = "AgentService/1.0"

    def _send_json(self, data, status=200):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def _read_body(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length).decode("utf-8")
            return json.loads(post_data) if post_data else {}
        except Exception:
            return {}

    def do_GET(self):
        path = urllib.parse.urlparse(self.path).path

        if path == "/health":
            self._send_json({
                "status": "healthy",
                "agents_loaded": 7,
                "rag_documents": len(rag_engine.documents),
                "memory_entries": len(orchestrator.conversation_memory)
            })
        elif path == "/memory":
            self._send_json({"memory_entries": orchestrator.conversation_memory})
        elif path == "/actionlog":
            self._send_json({"actions": ACTION_LOG[-50:], "total": len(ACTION_LOG)})
        elif path == "/students":
            self._send_json({"students": list(STUDENT_PROFILES.values())})
        elif path == "/events":
            self._send_json({"events": CAMPUS_EVENTS})
        elif path == "/internships":
            self._send_json({"internships": INTERNSHIP_LISTINGS})
        elif path == "/scholarships":
            self._send_json({"scholarships": SCHOLARSHIPS})
        elif path == "/transport":
            self._send_json({"routes": TRANSPORT_ROUTES})
        elif path == "/faqs":
            self._send_json({"faqs": CAMPUS_FAQS})
        elif path == "/grievances":
            self._send_json({"grievances": GRIEVANCE_TICKETS})
        else:
            self._send_json({"error": "Not found"}, 404)

    def do_POST(self):
        path = urllib.parse.urlparse(self.path).path
        body = self._read_body()

        if path == "/chat":
            query = body.get("query", "")
            student_id = body.get("student_id", "S101")
            result = orchestrator.process_query(user_query=query, student_id=student_id)
            result["action_log"] = ACTION_LOG[-8:]
            self._send_json(result)

        elif path == "/rag/search":
            query = body.get("query", "")
            top_k = body.get("top_k", 3)
            results = rag_engine.search(query=query, top_k=top_k)
            self._send_json({"query": query, "results": results})

        elif path == "/hitl/respond":
            draft_id = body.get("draft_id", "")
            action = body.get("action", "approve")
            for ticket in GRIEVANCE_TICKETS:
                if ticket.get("ticket_id") == draft_id:
                    ticket["status"] = "submitted" if action == "approve" else "cancelled"
            if action == "approve":
                log_action("Human-In-The-Loop", "approve",
                           f"User APPROVED draft {draft_id} â€” dispatched to recipient.", entity_id=draft_id)
                self._send_json({
                    "status": "approved",
                    "message": f"Email draft {draft_id} approved and dispatched to Dean of Examinations.",
                    "timestamp": "2026-08-07 14:02:00"
                })
            else:
                self._send_json({
                    "status": "rejected",
                    "message": f"Draft {draft_id} rejected by user.",
                    "timestamp": "2026-08-07 14:02:00"
                })

        else:
            self._send_json({"error": "Endpoint not found"}, 404)


if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    print(f"Agent Service starting on http://localhost:{PORT}")
    try:
        with socketserver.TCPServer(("", PORT), AgentServiceHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down agent service.")
    except OSError as e:
        if e.errno == 10048 or "10048" in str(e):
            print(f"\n[INFO] Agent Service is ALREADY running on http://localhost:{PORT}!")
        else:
            raise e
