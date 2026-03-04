from fastapi import FastAPI, Response, Request
from fastapi.responses import PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware

import os
import html
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv
from google import genai

# ------------------ ENV / GEMINI ------------------
load_dotenv()

GEMINI_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_KEY:
    raise RuntimeError("GEMINI_API_KEY not found in .env")

client = genai.Client(api_key=GEMINI_KEY)
MODEL = "gemini-2.5-flash"

# Optional email recipients (set these in .env if you want)
BOOKING_EMAIL = os.getenv("BOOKING_EMAIL")  # e.g. clinic inbox
DOCTOR_EMAIL = os.getenv("DOCTOR_EMAIL")    # fallback

# ------------------ APP / STORAGE ------------------
app = FastAPI()

# CORS for frontend (Vite runs on port 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

REBOOKINGS_DIR = Path("rebooking_requests")
REBOOKINGS_DIR.mkdir(exist_ok=True)

TICKETS_DIR = Path("tickets")
TICKETS_DIR.mkdir(exist_ok=True)

# In-memory state for the current call (hackathon-friendly)
REBOOKING_SESSIONS = {}  # {CallSid: {"identity": "..."}}

# ------------------ HELPERS ------------------
def write_rebooking_ticket(call_sid: str, caller: str, identity: str, new_datetime: str, summary: str) -> Path:
    ts = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    safe_sid = call_sid or "unknown"
    filename = REBOOKINGS_DIR / f"{ts}_REBOOKING_{safe_sid}.txt"

    content = (
        "Clearwater Ridge Nursing Station — REBOOKING REQUEST\n"
        f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
        f"CallSid: {call_sid}\n"
        f"Caller number: {caller}\n"
        f"Name + ID (raw): {identity}\n"
        f"Requested new date/time (raw): {new_datetime}\n\n"
        "AI summary:\n"
        f"{summary}\n"
    )

    filename.write_text(content, encoding="utf-8")
    return filename


def parse_rebooking_ticket(filepath: Path) -> dict | None:
    """Parse a rebooking ticket file into structured data for the frontend."""
    try:
        text = filepath.read_text(encoding="utf-8")
    except Exception:
        return None

    if "REBOOKING" not in text:
        return None

    data = {"filename": filepath.name, "callSid": "", "time": "", "caller": "", "identity": "", "requestedDatetime": "", "summary": "", "raw": text}

    for line in text.split("\n"):
        if line.startswith("Time:"):
            data["time"] = line.replace("Time:", "").strip()
        elif line.startswith("CallSid:"):
            data["callSid"] = line.replace("CallSid:", "").strip()
        elif line.startswith("Caller number:"):
            data["caller"] = line.replace("Caller number:", "").strip()
        elif line.startswith("Name + ID (raw):"):
            data["identity"] = line.replace("Name + ID (raw):", "").strip()
        elif line.startswith("Requested new date/time (raw):"):
            data["requestedDatetime"] = line.replace("Requested new date/time (raw):", "").strip()

    if "AI summary:" in text:
        summary_section = text.split("AI summary:")[-1].strip()
        data["summary"] = summary_section.split("\n\n")[0].replace("\n", " ").strip()

    return data


def parse_virtual_ticket(filepath: Path) -> dict | None:
    """Parse a virtual check-in ticket file into structured data for the frontend."""
    try:
        text = filepath.read_text(encoding="utf-8")
    except Exception:
        return None

    if "Virtual Check-in" not in text:
        return None

    data = {
        "filename": filepath.name,
        "callSid": "",
        "time": "",
        "caller": "",
        "patientName": "",
        "status": "",
        "patientStatement": "",
        "summary": "",
        "raw": text,
    }

    lines = text.split("\n")
    in_statement = False
    in_summary = False
    statement_lines = []
    summary_lines = []

    for line in lines:
        if line.startswith("Time:"):
            data["time"] = line.replace("Time:", "").strip()
        elif line.startswith("Call SID:") or line.startswith("CallSid:"):
            data["callSid"] = line.split(":", 1)[1].strip()
        elif line.startswith("Caller Number:"):
            data["caller"] = line.replace("Caller Number:", "").strip()
        elif line.startswith("Patient Name:"):
            data["patientName"] = line.replace("Patient Name:", "").strip()
        elif line.startswith("Status:"):
            data["status"] = line.replace("Status:", "").strip()
        elif line.strip() == "Patient Statement:":
            in_statement = True
            in_summary = False
        elif line.strip() == "AI Summary:":
            in_summary = True
            in_statement = False
        elif in_statement and line.strip():
            statement_lines.append(line.strip())
        elif in_summary and line.strip():
            summary_lines.append(line.strip())

    data["patientStatement"] = " ".join(statement_lines)
    data["summary"] = " ".join(summary_lines)
    return data


def send_email_if_configured(subject: str, body: str, to_email: str) -> bool:
    """
    Optional: Email via SendGrid.
    Requires:
      - SENDGRID_API_KEY in .env
      - SENDGRID_FROM_EMAIL in .env
      - pip install sendgrid
    If not configured, it safely does nothing.
    """
    sg_key = os.getenv("SENDGRID_API_KEY")
    from_email = os.getenv("SENDGRID_FROM_EMAIL")
    if not sg_key or not from_email or not to_email:
        return False

    try:
        from sendgrid import SendGridAPIClient
        from sendgrid.helpers.mail import Mail

        message = Mail(
            from_email=from_email,
            to_emails=to_email,
            subject=subject,
            plain_text_content=body,
        )
        SendGridAPIClient(sg_key).send(message)
        return True
    except Exception as e:
        print("SendGrid email failed:", e)
        return False


# ------------------ BASIC HEALTH CHECK ------------------
@app.get("/")
def home():
    return PlainTextResponse("OK - service is running")


# ------------------ REBOOKING TICKETS API (for frontend) ------------------
@app.get("/api/rebooking-tickets")
def list_rebooking_tickets():
    """List all rebooking tickets from rebooking_requests folder."""
    tickets = []
    for f in sorted(REBOOKINGS_DIR.glob("*_REBOOKING_*.txt"), reverse=True):
        parsed = parse_rebooking_ticket(f)
        if parsed:
            tickets.append(parsed)
    return {"tickets": tickets}


@app.delete("/api/rebooking-tickets/{filename}")
def delete_rebooking_ticket(filename: str):
    """Delete a rebooking ticket (e.g. when rejected)."""
    if ".." in filename or "/" in filename or "\\" in filename:
        return {"ok": False, "error": "Invalid filename"}
    filepath = REBOOKINGS_DIR / filename
    if not filepath.exists():
        return {"ok": False, "error": "Ticket not found"}
    filepath.unlink()
    return {"ok": True}


# ------------------ VIRTUAL CHECK-IN TICKETS API (for Follow Up tab) ------------------
@app.get("/api/virtual-tickets")
def list_virtual_tickets():
    """List all virtual check-in tickets from tickets folder."""
    tickets = []
    for f in sorted(TICKETS_DIR.glob("*.txt"), reverse=True):
        parsed = parse_virtual_ticket(f)
        if parsed:
            tickets.append(parsed)
    return {"tickets": tickets}


@app.delete("/api/virtual-tickets/{filename}")
def delete_virtual_ticket(filename: str):
    """Delete a virtual ticket (e.g. when resolved)."""
    if ".." in filename or "/" in filename or "\\" in filename:
        return {"ok": False, "error": "Invalid filename"}
    filepath = TICKETS_DIR / filename
    if not filepath.exists():
        return {"ok": False, "error": "Ticket not found"}
    filepath.unlink()
    return {"ok": True}

# =======================================================
# REBOOKING FLOW (THIS HAPPENS WHEN USER CALLS YOUR TWILIO NUMBER)
# Set your Twilio number webhook to:
#   https://YOUR_NGROK_URL.ngrok-free.dev/twilio/rebook   (POST)
# =======================================================

# Step 1: Ask for name + ID
@app.api_route("/twilio/rebook", methods=["GET", "POST"])
def rebook_start():
    twiml = """<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="/twilio/rebook/identity" method="POST" timeout="8" speechTimeout="auto">
    <Say voice="alice">
      Hi, this is the Clearwater Ridge Nursing Station rebooking assistant.
      What is your name and ID?
    </Say>
  </Gather>
  <Say voice="alice">I did not hear anything. Goodbye.</Say>
  <Hangup/>
</Response>
"""
    return Response(content=twiml, media_type="application/xml")


# Step 2: Save identity, ask for new date/time
@app.post("/twilio/rebook/identity")
async def rebook_identity(request: Request):
    form = await request.form()
    call_sid = form.get("CallSid", "")
    identity = (form.get("SpeechResult") or "").strip()

    REBOOKING_SESSIONS[call_sid] = {"identity": identity}

    # Try to extract just the name for a nicer response (optional; safe fallback)
    name_prompt = f"""
Extract the person's name from this text.
Return ONLY the name (no extra words). If unknown, return "there".

Text: "{identity}"
"""
    try:
        name_res = client.models.generate_content(model=MODEL, contents=name_prompt)
        name = (name_res.text or "").strip()
        if not name:
            name = "there"
    except Exception:
        name = "there"

    msg = f"Thank you for calling {name}. What date and time would you like to reschedule your appointment to?"

    twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="/twilio/rebook/finish" method="POST" timeout="10" speechTimeout="auto">
    <Say voice="alice">{html.escape(msg)}</Say>
  </Gather>
  <Say voice="alice">I did not hear anything. Goodbye.</Say>
  <Hangup/>
</Response>
"""
    return Response(content=twiml, media_type="application/xml")


# Step 3: Create ticket + confirm
@app.post("/twilio/rebook/finish")
async def rebook_finish(request: Request):
    form = await request.form()
    call_sid = form.get("CallSid", "")
    caller = form.get("From", "")
    new_datetime = (form.get("SpeechResult") or "").strip()

    identity = REBOOKING_SESSIONS.get(call_sid, {}).get("identity", "Unknown")

    # Gemini: summarize for staff
    summary_prompt = f"""
Write a short, clear summary for clinic staff (1-2 sentences).
Do NOT invent any details.
Include the requested new appointment time/date if present.

Patient identity (raw): "{identity}"
Requested new date/time (raw): "{new_datetime}"
"""
    summary_res = client.models.generate_content(model=MODEL, contents=summary_prompt)
    summary = (summary_res.text or "").strip() or "No summary available."

    # Write ticket
    ticket_path = write_rebooking_ticket(call_sid, caller, identity, new_datetime, summary)
    ticket_text = ticket_path.read_text(encoding="utf-8")
    print("REBOOKING ticket saved:", ticket_path)

    # Optional email
    recipient = BOOKING_EMAIL or DOCTOR_EMAIL
    emailed = False
    if recipient:
        emailed = send_email_if_configured(
            subject="Rebooking Request Ticket",
            body=ticket_text,
            to_email=recipient,
        )
    print("Emailed:", emailed)

    # cleanup
    REBOOKING_SESSIONS.pop(call_sid, None)

    final_msg = (
        "Sounds good. I will have one of the nurses confirm this with you "
        "in the next business day. Have a great day!"
    )

    twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">{html.escape(final_msg)}</Say>
  <Hangup/>
</Response>
"""
    return Response(content=twiml, media_type="application/xml")


# =======================================================
# VIRTUAL CHECK-IN FLOW (when someone CALLS your Twilio number)
# Twilio webhook for incoming calls: https://YOUR_NGROK_URL/twilio/voice
# =======================================================
CALL_SESSIONS = {}


def write_virtual_checkin_ticket(call_sid: str, name: str, caller: str, feeling: str, classification: str, summary: str) -> Path:
    ts = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    filename = TICKETS_DIR / f"{ts}_{classification}_{call_sid}.txt"

    content = (
        "Clearwater Ridge Nursing Station — Virtual Check-in Ticket\n"
        f"Time: {datetime.now()}\n"
        f"Call SID: {call_sid}\n"
        f"Caller Number: {caller}\n"
        f"Patient Name: {name}\n"
        f"Status: {classification}\n\n"
        "Patient Statement:\n"
        f"{feeling}\n\n"
        "AI Summary:\n"
        f"{summary}\n"
    )

    filename.write_text(content, encoding="utf-8")
    return filename


@app.api_route("/twilio/voice", methods=["GET", "POST"])
def ask_name():
    twiml = """<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="/twilio/name" method="POST" timeout="6" speechTimeout="auto">
    <Say voice="alice">
      Hi, this is a virtual check in from Clearwater Ridge Nursing Station.
      What is your name?
    </Say>
  </Gather>
  <Say>I did not hear anything. Goodbye.</Say>
  <Hangup/>
</Response>
"""
    return Response(content=twiml, media_type="application/xml")

# 2️⃣ Save NAME → ask FEELING
@app.post("/twilio/name")
async def save_name(request: Request):
    form = await request.form()
    call_sid = form.get("CallSid", "")
    name = (form.get("SpeechResult") or "Unknown").strip()

    CALL_SESSIONS[call_sid] = {"name": name}

    msg = f"Thank you for calling {name}. How have you been feeling since your appointment?"
    twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="/twilio/finish" method="POST" timeout="8" speechTimeout="auto">
    <Say voice="alice">{html.escape(msg)}</Say>
  </Gather>
  <Say>I did not hear anything. Goodbye.</Say>
  <Hangup/>
</Response>
"""
    return Response(content=twiml, media_type="application/xml")

# 3️⃣ Finish → classify, summarize, ticket
@app.post("/twilio/finish")
async def finish_call(request: Request):
    form = await request.form()
    call_sid = form.get("CallSid", "")
    caller = form.get("From", "")
    feeling = (form.get("SpeechResult") or "").strip()

    name = CALL_SESSIONS.get(call_sid, {}).get("name", "Unknown")

    # ---- Gemini: classify ----
    classify_prompt = f"""
Classify the patient's condition as GOOD or BAD.

GOOD = feeling fine, okay, better, no issues
BAD = worse, pain, symptoms, concerns

Reply with ONLY: GOOD or BAD

Patient said: "{feeling}"
"""
    res = client.models.generate_content(model=MODEL, contents=classify_prompt)
    classification = (res.text or "").strip().upper()
    if "GOOD" not in classification:
        classification = "BAD"

    # ---- Gemini: summarize ----
    summary_prompt = f"""
Write a 1–2 sentence clinical summary for a nurse.
Do not invent details.

Patient: {name}
Statement: "{feeling}"
"""
    summary = client.models.generate_content(
        model=MODEL, contents=summary_prompt
    ).text.strip()

    # ---- Ticket ----
    ticket = write_virtual_checkin_ticket(call_sid, name, caller, feeling, classification, summary)
    print("Ticket created:", ticket)

    # ---- Respond to caller ----
    if classification == "GOOD":
        msg = "I’m glad to hear that. Thank you for your time. Have a wonderful day!"
        twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>{html.escape(msg)}</Say>
  <Hangup/>
</Response>
"""
    else:
        msg = "I’m sorry to hear that. I will put you through to a nurse for a more thorough check in."
        twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>{html.escape(msg)}</Say>
  <Say>Please stay on the line.</Say>
</Response>
"""

    CALL_SESSIONS.pop(call_sid, None)

    return Response(content=twiml, media_type="application/xml")