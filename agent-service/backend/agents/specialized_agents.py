"""
Specialized AI Agents for Smart Campus System
Includes Academic, Placement, Events, Student Services, Knowledge (RAG), and Communication/Calendar Agents
"""

import json
import math
from typing import Dict, Any, List
from backend.data.mock_db import (
    STUDENT_PROFILES, INTERNSHIP_LISTINGS, CAMPUS_EVENTS, CLUBS_AND_COMMUNITIES, TIMETABLES,
    HOSTEL_DATA, SCHOLARSHIPS, TRANSPORT_ROUTES, CAMPUS_FAQS, GRIEVANCE_TICKETS, log_action
)
from backend.rag.rag_engine import rag_engine

class SpecializedAgents:
    @staticmethod
    def academic_agent(action: str, params: Dict[str, Any], student_id: str = "S101") -> Dict[str, Any]:
        student = STUDENT_PROFILES.get(student_id, STUDENT_PROFILES["S101"])
        
        if action == "get_timetable":
            day = params.get("day", "Today")
            timetable = TIMETABLES.get("CSE-3", {}).get(day, TIMETABLES["CSE-3"]["Today"])
            summary = f"Retrieved {day}'s class schedule ({len(timetable)} classes) for {student['name']}."
            log_action("Academic Agent", "get_timetable", summary)
            return {
                "agent": "Academic Agent",
                "tool": "get_timetable",
                "status": "success",
                "data": {
                    "student": student["name"],
                    "branch": student["branch"],
                    "day": day,
                    "schedule": timetable
                },
                "summary": summary
            }

        elif action == "calculate_attendance":
            attended = student["attended_classes"]
            total = student["total_classes"]
            current_pct = student["attendance_percentage"]
            
            # Simulate impact of 5 missed classes
            missed_5_pct = round(((attended) / (total + 5)) * 100, 2)
            # Classes needed to reach 85%
            needed_classes = max(0, math.ceil((0.85 * total - attended) / 0.15))
            
            eligibility_status = "Eligible" if current_pct >= 75.0 else ("Condonation Eligible" if current_pct >= 65.0 else "Detained")

            summary = f"Calculated attendance for {student['name']}: {current_pct}%. Status: {eligibility_status}."
            log_action("Academic Agent", "calculate_attendance", summary)
            return {
                "agent": "Academic Agent",
                "tool": "calculate_attendance",
                "status": "success",
                "data": {
                    "student_name": student["name"],
                    "current_attendance": f"{current_pct}% ({attended}/{total} classes)",
                    "status": eligibility_status,
                    "missed_5_classes_projection": f"{missed_5_pct}%",
                    "min_required_threshold": "75.0%",
                    "condonation_threshold": "65.0%"
                },
                "summary": summary
            }

        elif action == "recommend_electives":
            summary = f"Generated elective recommendations based on {student['name']}'s GPA ({student['gpa']}) and AI interest."
            log_action("Academic Agent", "recommend_electives", summary)
            return {
                "agent": "Academic Agent",
                "tool": "recommend_electives",
                "status": "success",
                "data": {
                    "recommended_courses": [
                        {"code": "CS405", "name": "Deep Learning & Neural Networks", "credits": 4, "prereq": "CS301 AI & ML"},
                        {"code": "CS409", "name": "Autonomous Agent Architectures", "credits": 3, "prereq": "Python"}
                    ]
                },
                "summary": summary
            }

        return {"agent": "Academic Agent", "status": "unknown_action"}

    @staticmethod
    def placement_agent(action: str, params: Dict[str, Any], student_id: str = "S101") -> Dict[str, Any]:
        student = STUDENT_PROFILES.get(student_id, STUDENT_PROFILES["S101"])
        
        if action == "check_eligibility":
            company_query = params.get("company", "Google").lower()
            matching_listing = None
            for item in INTERNSHIP_LISTINGS:
                if company_query in item["company"].lower():
                    matching_listing = item
                    break

            if not matching_listing:
                matching_listing = INTERNSHIP_LISTINGS[0]

            is_gpa_eligible = student["gpa"] >= matching_listing["min_cgpa"]
            is_backlog_eligible = student["active_backlogs"] <= matching_listing["max_backlogs"]
            is_year_eligible = student["year"] in matching_listing["eligible_years"]
            
            is_eligible = is_gpa_eligible and is_backlog_eligible and is_year_eligible

            log_action("Placement Agent", "check_eligibility", f"{student['name']} {'ELIGIBLE' if is_eligible else 'NOT ELIGIBLE'} for {matching_listing['company']} ({matching_listing['role']}).")
            return {
                "agent": "Placement Agent",
                "tool": "check_eligibility",
                "status": "success",
                "data": {
                    "student_name": student["name"],
                    "company": matching_listing["company"],
                    "role": matching_listing["role"],
                    "eligible": is_eligible,
                    "criteria_breakdown": {
                        "gpa_check": f"Student GPA {student['gpa']} vs Min Required {matching_listing['min_cgpa']} ({'PASS' if is_gpa_eligible else 'FAIL'})",
                        "backlog_check": f"Student Backlogs {student['active_backlogs']} vs Max Allowed {matching_listing['max_backlogs']} ({'PASS' if is_backlog_eligible else 'FAIL'})",
                        "year_check": f"Student Year {student['year']} vs Allowed Years {matching_listing['eligible_years']} ({'PASS' if is_year_eligible else 'FAIL'})"
                    },
                    "stipend": matching_listing["stipend"],
                    "deadline": matching_listing["deadline"]
                },
                "summary": f"{student['name']} is {'ELIGIBLE' if is_eligible else 'NOT ELIGIBLE'} for {matching_listing['company']} ({matching_listing['role']})."
            }

        elif action == "analyze_resume":
            log_action("Placement Agent", "analyze_resume", f"Analyzed resume for {student['name']}. Resume Score: 88/100.")
            return {
                "agent": "Placement Agent",
                "tool": "analyze_resume",
                "status": "success",
                "data": {
                    "student": student["name"],
                    "resume_score": "88/100",
                    "strengths": ["Strong CGPA (8.75)", "AI/ML Project Stack", "Zero Backlogs"],
                    "suggestions": ["Add GitHub repository links for ML projects", "Include metrics on project throughput"]
                },
                "summary": f"Analyzed resume for {student['name']}. Resume Score: 88/100."
            }

        return {"agent": "Placement Agent", "status": "unknown_action"}

    @staticmethod
    def events_agent(action: str, params: Dict[str, Any], student_id: str = "S101") -> Dict[str, Any]:
        student = STUDENT_PROFILES.get(student_id, STUDENT_PROFILES["S101"])

        if action == "discover_events" or action == "recommend_workshops":
            query = params.get("topic", "AI").lower()
            matched_events = [e for e in CAMPUS_EVENTS if query in e["title"].lower() or query in e["category"].lower() or query in e["organizer"].lower()]
            if not matched_events:
                matched_events = CAMPUS_EVENTS

            matched_clubs = [c for c in CLUBS_AND_COMMUNITIES if any(query in f.lower() for f in c["focus"]) or query in c["name"].lower()]

            log_action("Events Agent", "discover_events", f"Found {len(matched_events)} matching workshops and {len(matched_clubs)} related campus clubs for query '{query}'.")
            return {
                "agent": "Events Agent",
                "tool": "discover_events",
                "status": "success",
                "data": {
                    "workshops": matched_events,
                    "clubs": matched_clubs
                },
                "summary": f"Found {len(matched_events)} matching workshops and {len(matched_clubs)} related campus clubs for query '{query}'."
            }

        elif action == "register_event":
            event_title = params.get("event_title", "Google Placement & Internship Prep Workshop")
            summary = f"Successfully registered {student['name']} for '{event_title}' (Reg ID: REG-884920)."
            log_action("Events Agent", "register_event", summary, entity_id="REG-884920")
            return {
                "agent": "Events Agent",
                "tool": "register_event",
                "status": "success",
                "data": {
                    "registration_id": "REG-884920",
                    "event_title": event_title,
                    "student_name": student["name"],
                    "email": student["email"],
                    "status": "CONFIRMED",
                    "seat_number": "Seat B-42"
                },
                "summary": summary
            }

        return {"agent": "Events Agent", "status": "unknown_action"}

    @staticmethod
    def knowledge_agent(action: str, params: Dict[str, Any]) -> Dict[str, Any]:
        query = params.get("query", "examination regulations attendance makeup exam")
        results = rag_engine.search(query=query, top_k=3)

        log_action("Knowledge Agent (RAG)", "rag_search", f"Retrieved {len(results)} institutional regulations/policies matching query '{query}'.")
        return {
            "agent": "Knowledge Agent (RAG)",
            "tool": "rag_search",
            "status": "success",
            "data": {
                "query": query,
                "sources_found": len(results),
                "citations": results
            },
            "summary": f"Retrieved {len(results)} institutional regulations/policies matching query '{query}'."
        }

    @staticmethod
    def communication_calendar_agent(action: str, params: Dict[str, Any], student_id: str = "S101") -> Dict[str, Any]:
        student = STUDENT_PROFILES.get(student_id, STUDENT_PROFILES["S101"])

        if action == "draft_email":
            recipient = params.get("recipient", "Dean of Examinations <examdean@xyz.edu.in>")
            subject = params.get("subject", "Request for Permission for Makeup Examination")
            reason = params.get("reason", "Attendance calculation and sanctioned representation")
            
            body = f"""Dear Dean of Examinations,

I am writing to formally request permission for a makeup examination.

Student Details:
- Name: {student['name']}
- Roll Number: {student['roll_number']}
- Branch: {student['branch']} (Year {student['year']})
- Current CGPA: {student['gpa']}

Reason:
{reason}

I have maintained satisfactory academic standing and request your kind approval per Section 4.4 of the XYZ Academic Regulations.

Sincerely,
{student['name']}
Contact: {student['email']}
"""
            log_action("Communication & Calendar Agent", "draft_email", f"Drafted email to {recipient}. Pushed to Human-In-The-Loop approval queue.", entity_id="DRAFT-EMAIL-991")
            return {
                "agent": "Communication & Calendar Agent",
                "tool": "draft_email",
                "status": "requires_approval", # Triggers HITL
                "requires_hitl": True,
                "data": {
                    "recipient": recipient,
                    "subject": subject,
                    "body": body,
                    "draft_id": "DRAFT-EMAIL-991"
                },
                "summary": f"Drafted email to {recipient}. Pushed to Human-In-The-Loop approval queue."
            }

        elif action == "add_calendar_event":
            title = params.get("title", "Google Placement Workshop")
            date = params.get("date", "Tomorrow (2026-08-08)")
            time = params.get("time", "10:00 AM")

            log_action("Communication & Calendar Agent", "add_calendar_event", f"Added '{title}' to {student['name']}'s calendar for {date} at {time}.", entity_id="CAL-7712")
            return {
                "agent": "Communication & Calendar Agent",
                "tool": "add_calendar_event",
                "status": "success",
                "data": {
                    "event_id": "CAL-7712",
                    "title": title,
                    "date": date,
                    "time": time,
                    "calendar": f"{student['name']}'s Campus Google Calendar"
                },
                "summary": f"Added '{title}' to {student['name']}'s calendar for {date} at {time}."
            }

        elif action == "schedule_reminder":
            title = params.get("title", "Google Placement Workshop")
            reminder_time = params.get("reminder_time", "1 Hour Before (09:00 AM)")

            log_action("Communication & Calendar Agent", "schedule_reminder", f"Scheduled reminder for '{title}' set to trigger {reminder_time}.", entity_id="REM-4091")
            return {
                "agent": "Communication & Calendar Agent",
                "tool": "schedule_reminder",
                "status": "success",
                "data": {
                    "reminder_id": "REM-4091",
                    "title": title,
                    "trigger_at": reminder_time,
                    "channel": "Mobile Push Notification & Desktop Alert"
                },
                "summary": f"Scheduled reminder for '{title}' set to trigger {reminder_time}."
            }

        return {"agent": "Communication & Calendar Agent", "status": "unknown_action"}

    @staticmethod
    def student_services_agent(action: str, params: Dict[str, Any], student_id: str = "S101") -> Dict[str, Any]:
        student = STUDENT_PROFILES.get(student_id, STUDENT_PROFILES["S101"])

        if action == "get_hostel_info":
            log_action("Student Services Agent", "get_hostel_info", f"Retrieved hostel details for {student['name']} (accommodation: {student['hostel_block']}).")
            return {
                "agent": "Student Services Agent",
                "tool": "get_hostel_info",
                "status": "success",
                "data": {
                    "student_name": student["name"],
                    "resident": student["hostel_resident"],
                    "accommodation": student["hostel_block"],
                    "details": HOSTEL_DATA
                },
                "summary": f"Retrieved hostel details for {student['name']} (accommodation: {student['hostel_block']})."
            }

        elif action == "check_scholarships":
            log_action("Student Services Agent", "check_scholarships", f"Found {len(SCHOLARSHIPS)} scholarship opportunities relevant for {student['name']}.")
            return {
                "agent": "Student Services Agent",
                "tool": "check_scholarships",
                "status": "success",
                "data": {
                    "student_name": student["name"],
                    "gpa": student["gpa"],
                    "branch": student["branch"],
                    "scholarships": SCHOLARSHIPS
                },
                "summary": f"Found {len(SCHOLARSHIPS)} scholarship opportunities relevant for {student['name']}."
            }

        elif action == "file_grievance":
            category = params.get("category", "Infrastructure")
            description = params.get("description", "Wi-Fi connectivity issue in hostel block")
            ticket_id = f"GRV-{1001 + len(GRIEVANCE_TICKETS)}"
            GRIEVANCE_TICKETS.append({
                "ticket_id": ticket_id,
                "student_id": student["id"],
                "student_name": student["name"],
                "category": category,
                "description": description,
                "status": "pending_approval"
            })
            log_action("Student Services Agent", "file_grievance", f"Prepared grievance ticket {ticket_id} ({category}) for {student['name']}. Awaiting user confirmation (HITL).", entity_id=ticket_id)
            return {
                "agent": "Student Services Agent",
                "tool": "file_grievance",
                "status": "requires_approval",
                "requires_hitl": True,
                "data": {
                    "ticket_id": ticket_id,
                    "category": category,
                    "description": description,
                    "student_name": student["name"],
                    "expected_sla": "48 hours",
                    "recipient": "student-services@xyz.edu.in"
                },
                "summary": f"Prepared grievance ticket {ticket_id} ({category}) for {student['name']}. Awaiting user confirmation (HITL)."
            }

        elif action == "get_transport_info":
            log_action("Student Services Agent", "get_transport_info", f"Returned {len(TRANSPORT_ROUTES)} campus bus routes with pickup timings.")
            return {
                "agent": "Student Services Agent",
                "tool": "get_transport_info",
                "status": "success",
                "data": {"routes": TRANSPORT_ROUTES},
                "summary": f"Returned {len(TRANSPORT_ROUTES)} campus bus routes with pickup timings."
            }

        elif action == "get_campus_faq":
            query = params.get("query", "").lower()
            matched = [f for f in CAMPUS_FAQS if query in f["q"].lower() or query in f["a"].lower()]
            faqs = matched if matched else CAMPUS_FAQS
            log_action("Student Services Agent", "get_campus_faq", f"Matched {len(faqs)} campus FAQ entries for query '{query}'.")
            return {
                "agent": "Student Services Agent",
                "tool": "get_campus_faq",
                "status": "success",
                "data": {"faqs": faqs},
                "summary": f"Matched {len(faqs)} campus FAQ entries for query '{query}'."
            }

        return {"agent": "Student Services Agent", "status": "unknown_action"}
