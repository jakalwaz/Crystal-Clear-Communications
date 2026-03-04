# ClearRide Nurse Command Center

## Backend Integration Points

This frontend prototype is designed to be connected to a robust backend system. Below are the key areas where API integrations should be implemented.

### 1. Weather Alerts (Dashboard)
In `pages/Dashboard.tsx`, the Alerts Section currently uses mock data for "Blizzard Warning".
To make this real, connect to a weather API like **OpenWeatherMap** or **WeatherAPI**.

```typescript
// Example Implementation in Dashboard.tsx
useEffect(() => {
  fetch('https://api.openweathermap.org/data/2.5/weather?q=Toronto&appid=YOUR_API_KEY')
    .then(res => res.json())
    .then(data => {
       // Check for severity (snow, storm) and update alert state
    });
}, []);
```

### 2. Network / Bluetooth Status
In `pages/Dashboard.tsx`, the Bluetooth status is currently simulated using `navigator.bluetooth.getAvailability()`.
For a full deployment:
- **Web Bluetooth API:** Ensure the app is served over HTTPS.
- **Device Health:** Connect to a backend websocket that monitors the actual hardware status of the dispatch tablets if they report their status centrally.

### 3. AI Dispatch Console
In `pages/Dispatch.tsx`, the "AI Call Analysis" and transcripts are static.
Integrate with an LLM service (like **OpenAI GPT-4** or **Google Gemini**) and a Speech-to-Text service (like **AWS Transcribe** or **Google Cloud Speech**).

- **Transcription:** Stream audio from the `navigator.mediaDevices.getUserMedia` to a websocket for real-time transcription.
- **Intent Analysis:** Send the transcript window to an LLM to extract:
  - `intent`: (e.g., "Requesting ride")
  - `sentiment`: (e.g., "Anxious")
  - `entities`: (e.g., "Dialysis", "123 Maple Ave")

### 4. Real-time Task & Patient Database
The "Action Center" tasks and "Patient Directory" in `pages/Dashboard.tsx` and `pages/Directory.tsx` use local state.
Connect these to a real-time database like **Firebase Firestore** or **Supabase**.

- **Patients:** `GET /api/patients`
- **Tasks:** `GET /api/tasks` (Websockets for real-time updates when new incidents occur)

### 5. Rescheduling & Tickets
In `pages/AI_MoveAppointment.tsx`, the ticket logic is client-side.
- **Submit Ticket:** `POST /api/tickets/move` should trigger a backend process that:
  1. Checks driver availability in the DB.
  2. Re-optimizes the route.
  3. Notifies the patient via SMS (Twilio integration).
