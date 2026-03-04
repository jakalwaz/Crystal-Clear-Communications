# Crystal Clear Communications

An AI-powered phone system built for nursing stations. Patients can call in for virtual check-ins or to rebook appointments — the AI handles the conversation, classifies urgency, and generates tickets for staff to review.

Built at the Spark Hackathon.

## Features

### Virtual Check-In
- Patient calls in, AI asks their name and how they've been feeling since their last appointment
- Gemini AI classifies the response as **GOOD** or **BAD**
- If GOOD: thanks the patient and hangs up
- If BAD: informs the patient a nurse will follow up and creates a priority ticket

### Appointment Rebooking
- Patient calls in, AI collects their name/ID and preferred new date/time
- Generates a structured rebooking ticket for clinic staff
- Optional email notification via SendGrid

### Staff Dashboard (Frontend)
- React/TypeScript frontend to view and manage open tickets
- Separate tabs for virtual check-in follow-ups and rebooking requests
- Dismiss/resolve tickets directly from the UI

## Tech Stack

- **Backend:** FastAPI + Python
- **AI:** Google Gemini 2.5 Flash
- **Phone:** Twilio (voice webhooks + TwiML)
- **Frontend:** React, TypeScript, Vite
- **Tunneling:** ngrok (for local development)
- **Email (optional):** SendGrid

## Setup

### 1. Install backend dependencies
```
pip install -r requirements.txt
```

### 2. Create a `.env` file
```
GEMINI_API_KEY=your_gemini_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token

# Optional email notifications
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=you@example.com
BOOKING_EMAIL=clinic@example.com
```

### 3. Run the backend
```
uvicorn main:app --reload
```

### 4. Expose with ngrok
```
ngrok http 8000
```

### 5. Set Twilio webhooks
| Flow | Webhook URL |
|------|------------|
| Virtual check-in | `https://YOUR_NGROK_URL/twilio/voice` |
| Rebooking | `https://YOUR_NGROK_URL/twilio/rebook` |

### 6. Run the frontend
```
cd Frontend
npm install
npm run dev
```
