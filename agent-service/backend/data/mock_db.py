"""
Smart Campus Multi-Agent System - Mock Institutional Database
XYZ Engineering College (Autonomous)
"""

STUDENT_PROFILES = {
    "S101": {
        "id": "S101",
        "name": "Alex Chen",
        "roll_number": "1602-23-733-042",
        "branch": "Computer Science & Engineering (CSE)",
        "year": 3,
        "semester": 6,
        "gpa": 8.75,
        "active_backlogs": 0,
        "attendance_percentage": 82.4,
        "total_classes": 180,
        "attended_classes": 148,
        "email": "alex.chen@xyz.edu.in",
        "phone": "+91 98765 43210",
        "hostel_resident": True,
        "hostel_block": "B-Block, Room 304",
        "registered_courses": [
            {"code": "CS301", "name": "Artificial Intelligence & Machine Learning", "credits": 4, "faculty": "Dr. R. Sharma"},
            {"code": "CS302", "name": "Database Management Systems", "credits": 3, "faculty": "Prof. K. Venkatesh"},
            {"code": "CS303", "name": "Operating Systems", "credits": 3, "faculty": "Dr. S. Lakshmi"},
            {"code": "CS304", "name": "Design & Analysis of Algorithms", "credits": 4, "faculty": "Prof. M. Reddy"}
        ],
        "skills": ["Python", "TensorFlow", "React", "Data Structures", "SQL"],
        "resume_summary": "3rd Year CSE Undergrad passionate about AI/ML & Web Systems. Built 3 full-stack projects, 8.75 CGPA, zero backlogs.",
        "calendar_events": [
            {"id": "EV1", "title": "CS301 Mid-Exam", "date": "2026-08-10", "time": "10:00 AM", "category": "Exam"},
            {"id": "EV2", "title": "ML Club Meetup", "date": "2026-08-12", "time": "04:00 PM", "category": "Club"}
        ]
    },
    "S102": {
        "id": "S102",
        "name": "Priya Sharma",
        "roll_number": "1602-22-735-018",
        "branch": "Electronics & Communication Engineering (ECE)",
        "year": 4,
        "semester": 8,
        "gpa": 9.12,
        "active_backlogs": 0,
        "attendance_percentage": 91.0,
        "total_classes": 200,
        "attended_classes": 182,
        "email": "priya.sharma@xyz.edu.in",
        "phone": "+91 98765 12345",
        "hostel_resident": False,
        "hostel_block": "Day Scholar",
        "registered_courses": [
            {"code": "EC401", "name": "VLSI Design & Embedded Systems", "credits": 4, "faculty": "Dr. A. Rao"}
        ],
        "skills": ["Embedded C", "Python", "Verilog", "IoT", "MATLAB"],
        "resume_summary": "4th Year ECE student specializing in IoT & Embedded Hardware. 9.12 CGPA, Dean's List recipient.",
        "calendar_events": []
    },
    "S103": {
        "id": "S103",
        "name": "Rahul Verma",
        "roll_number": "1602-24-736-089",
        "branch": "Mechanical Engineering (ME)",
        "year": 2,
        "semester": 4,
        "gpa": 7.10,
        "active_backlogs": 1,
        "attendance_percentage": 68.5,
        "total_classes": 160,
        "attended_classes": 110,
        "email": "rahul.verma@xyz.edu.in",
        "phone": "+91 98765 99887",
        "hostel_resident": True,
        "hostel_block": "A-Block, Room 102",
        "registered_courses": [
            {"code": "ME201", "name": "Thermodynamics & Heat Transfer", "credits": 4, "faculty": "Dr. N. Swamy"}
        ],
        "skills": ["AutoCAD", "SolidWorks", "Python Basics"],
        "resume_summary": "2nd Year Mechanical Engineering student active in Robotics Club.",
        "calendar_events": []
    }
}

# Mock authentication — maps a login UID/Password to a student profile.
USERS = {
    "chen": {
        "password": "chen@2026",
        "name": "Alex Chen",
        "student_id": "S101",
        "role": "student"
    },
    "priya": {
        "password": "priya@2026",
        "name": "Priya Sharma",
        "student_id": "S102",
        "role": "student"
    },
    "rahul": {
        "password": "rahul@2026",
        "name": "Rahul Verma",
        "student_id": "S103",
        "role": "student"
    },
    "admin": {
        "password": "admin@2026",
        "name": "System Administrator",
        "student_id": "S101",
        "role": "admin"
    }
}

INTERNSHIP_LISTINGS = [
    {
        "id": "INT-GGL-01",
        "company": "Google",
        "role": "Software Engineering Intern - Summer 2026",
        "stipend": "₹1,25,000 / month",
        "duration": "2 Months",
        "eligible_years": [3, 4],
        "eligible_branches": ["CSE", "IT", "ECE"],
        "min_cgpa": 8.0,
        "max_backlogs": 0,
        "deadline": "2026-08-15",
        "description": "Work with Google Cloud and Core Search teams in Hyderabad on distributed backend infrastructure."
    },
    {
        "id": "INT-MSFT-02",
        "company": "Microsoft",
        "role": "AI / ML Research Intern",
        "stipend": "₹1,10,000 / month",
        "duration": "2 Months",
        "eligible_years": [3, 4],
        "eligible_branches": ["CSE", "IT", "ECE", "EEE"],
        "min_cgpa": 8.5,
        "max_backlogs": 0,
        "deadline": "2026-08-18",
        "description": "Collaborate with Microsoft India Development Center (IDC) on LLM fine-tuning and Autonomous Agent R&D."
    },
    {
        "id": "INT-TCS-03",
        "company": "TCS Innovator",
        "role": "Full-Stack Trainee Intern",
        "stipend": "₹35,000 / month",
        "duration": "3 Months",
        "eligible_years": [2, 3, 4],
        "eligible_branches": ["All Branches"],
        "min_cgpa": 6.5,
        "max_backlogs": 1,
        "deadline": "2026-08-25",
        "description": "Hands-on experience with modern cloud workflows and web architecture."
    }
]

CAMPUS_EVENTS = [
    {
        "id": "EVT-101",
        "title": "Google Placement & Internship Prep Workshop",
        "organizer": "Placement & Training Cell",
        "category": "Placement Workshop",
        "date": "Tomorrow (2026-08-08)",
        "time": "10:00 AM - 01:00 PM",
        "location": "Auditorium Block B",
        "speaker": "Ex-Googler S. Sundar (Staff Software Engineer)",
        "prerequisites": "Eligible 3rd & 4th Year CSE/ECE/IT students",
        "seats_left": 34
    },
    {
        "id": "EVT-102",
        "title": "AgentX National Level Hackathon 2026",
        "organizer": "HackerRank Campus Crew & VCE ACM",
        "category": "Hackathon",
        "date": "2026-08-14 to 2026-08-15",
        "time": "24-Hour Event",
        "location": "VCE Innovation Hub & Online",
        "prizes": "₹1,50,000 Cash Pool + Direct Interview Shorts",
        "seats_left": 12
    },
    {
        "id": "EVT-103",
        "title": "Generative AI & LLM Fine-Tuning Masterclass",
        "organizer": "AI & Data Science Club",
        "category": "Workshop",
        "date": "2026-08-11",
        "time": "02:00 PM - 05:00 PM",
        "location": "Lab 7, CS Building",
        "seats_left": 8
    }
]

CLUBS_AND_COMMUNITIES = [
    {
        "id": "CLUB-01",
        "name": "Machine Learning & AI Group (MLAG)",
        "focus": ["Machine Learning", "Deep Learning", "LLMs", "Computer Vision"],
        "lead": "Alex Chen & Prof. R. Sharma",
        "upcoming_meetup": "2026-08-12",
        "contact": "mlag@xyz.edu.in"
    },
    {
        "id": "CLUB-02",
        "name": "VCE ACM Student Chapter",
        "focus": ["Competitive Programming", "Algorithms", "Hackathons"],
        "lead": "Priya Sharma",
        "upcoming_meetup": "2026-08-10",
        "contact": "acm@xyz.edu.in"
    },
    {
        "id": "CLUB-03",
        "name": "Robotics & Embedded Systems Club",
        "focus": ["Arduino", "Raspberry Pi", "ROS", "Drone Tech"],
        "lead": "K. Rajesh",
        "upcoming_meetup": "2026-08-15",
        "contact": "robotics@xyz.edu.in"
    }
]

TIMETABLES = {
    "CSE-3": {
        "Monday": [
            {"time": "09:20 - 10:20", "subject": "CS301 AI & ML", "room": "CS-201"},
            {"time": "10:20 - 11:20", "subject": "CS302 DBMS", "room": "CS-201"},
            {"time": "11:30 - 12:30", "subject": "CS304 Algorithms", "room": "CS-201"},
            {"time": "01:20 - 04:20", "subject": "AI/ML Lab", "room": "Lab 5"}
        ],
        "Today": [
            {"time": "09:20 - 10:20", "subject": "CS301 AI & ML", "room": "CS-201"},
            {"time": "10:20 - 11:20", "subject": "CS302 DBMS", "room": "CS-201"},
            {"time": "11:30 - 12:30", "subject": "CS303 Operating Systems", "room": "CS-201"},
            {"time": "01:20 - 04:20", "subject": "DBMS Project Lab", "room": "Lab 3"}
        ]
    }
}

HOSTEL_DATA = {
    "in_time": "08:30 PM",
    "mess_timings": {
        "Breakfast": "07:00 - 09:00 AM",
        "Lunch": "12:30 - 02:00 PM",
        "Dinner": "07:30 - 09:30 PM"
    },
    "warden_contact": "warden@xyz.edu.in | Ext. 204",
    "laundry": "Saturday pickups, Ground Floor Office",
    "wifi": "VCE-ResNet SSID, credentials via intranet portal",
    "night_out_pass": "Submit 24 hours in advance via Student Portal, approved by Warden"
}

SCHOLARSHIPS = [
    {
        "id": "SCH-01",
        "name": "Management Merit Scholarship",
        "amount": "₹25,000 / annum",
        "criteria": "Top 3 rankers per branch",
        "deadline": "September 30",
        "category": "Merit"
    },
    {
        "id": "SCH-02",
        "name": "State Post-Matric Scholarship",
        "amount": "Fee waiver + ₹15,000",
        "criteria": "Family income < ₹2.5 LPA, 60%+ marks",
        "deadline": "August 20",
        "category": "Economically Weaker"
    },
    {
        "id": "SCH-03",
        "name": "Women in STEM Fellowship",
        "amount": "₹40,000 / annum",
        "criteria": "Female students, CGPA 8.0+, CSE/ECE/IT",
        "deadline": "September 5",
        "category": "Diversity"
    }
]

TRANSPORT_ROUTES = [
    {
        "id": "BUS-01",
        "route": "Route 12 - Mehdipatnam",
        "pickup": "06:40 AM",
        "drop": "04:30 PM",
        "stops": ["Mehdipatnam", "Asif Nagar", "Nanal Nagar", "College"]
    },
    {
        "id": "BUS-02",
        "route": "Route 07 - Kukatpally",
        "pickup": "07:00 AM",
        "drop": "05:00 PM",
        "stops": ["KPHB", "JNTU", "Nizampet", "College"]
    },
    {
        "id": "BUS-03",
        "route": "Route 21 - Uppal",
        "pickup": "06:50 AM",
        "drop": "04:45 PM",
        "stops": ["Uppal X Roads", "Nacharam", "Secunderabad", "College"]
    }
]

CAMPUS_FAQS = [
    {
        "q": "How do I request a bonafide certificate?",
        "a": "Submit via Student Services Portal; issued within 48 hours at the Administrative Office, Room 12, Ground Floor."
    },
    {
        "q": "How do I change my lab batch?",
        "a": "Approach the HOD office with a signed undertaking; batch swaps are allowed in the first 2 weeks of the semester."
    },
    {
        "q": "Where can I access the library after hours?",
        "a": "Central Library (Block A, 2nd Floor) is open 08:00 AM - 08:00 PM on working days."
    },
    {
        "q": "How do I reset my Wi-Fi password?",
        "a": "Self-service via the intranet portal or visit the IT Helpdesk in the CS Building."
    },
    {
        "q": "How do I apply for exam fee reimbursement?",
        "a": "Download the reimbursement form from the Examination Cell counter, attach fee receipts, and submit before the 10th of the following month."
    }
]

GRIEVANCE_TICKETS = []

# Persistent in-memory log of every agent action performed during this run.
# Registrations, reminders, emails, grievances etc. are "recorded" here.
ACTION_LOG = []

def log_action(agent, tool, summary, entity_id=None):
    import datetime
    ACTION_LOG.append({
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "agent": agent,
        "tool": tool,
        "entity_id": entity_id or "",
        "summary": summary
    })
    if len(ACTION_LOG) > 100:
        ACTION_LOG.pop(0)
