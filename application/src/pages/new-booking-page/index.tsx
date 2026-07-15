import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Dayjs } from "dayjs";
import { API_BASE, getAccessToken } from "../../lib/api";

type SessionType = "PRIVATE_LESSON" | "GROUP_SESSION";

interface UserOption {
  id: string;
  firstName: string;
  lastName: string;
}

interface CourtOption {
  id: string;
  number: number;
  venue: { name: string };
}

export default function NewBookingPage() {
  const navigate = useNavigate();

  const [students, setStudents] = useState<UserOption[]>([]);
  const [coaches, setCoaches] = useState<UserOption[]>([]);
  const [courts, setCourts] = useState<CourtOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  const [studentId, setStudentId] = useState("");
  const [coachId, setCoachId] = useState("");
  const [courtId, setCourtId] = useState("");
  const [startDateTime, setStartDateTime] = useState<Dayjs | null>(null);
  const [endDateTime, setEndDateTime] = useState<Dayjs | null>(null);
  const [sessionType, setSessionType] = useState<SessionType>("PRIVATE_LESSON");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${getAccessToken()}` };

    Promise.all([
      fetch(`${API_BASE}/users?role=CUSTOMER`, { headers }).then((r) => r.json()),
      fetch(`${API_BASE}/users?role=STAFF`, { headers }).then((r) => r.json()),
      fetch(`${API_BASE}/courts`, { headers }).then((r) => r.json()),
    ])
      .then(([studentsRes, coachesRes, courtsRes]) => {
        setStudents(studentsRes);
        setCoaches(coachesRes);
        setCourts(courtsRes);
      })
      .catch(() => setOptionsError("Could not load students, coaches or courts."))
      .finally(() => setLoadingOptions(false));
  }, []);

  const handleSubmit = async () => {
    setSubmitError(null);

    if (!studentId || !coachId || !courtId || !startDateTime || !endDateTime) {
      setSubmitError("All fields except notes are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({
          studentId,
          coachId,
          courtId,
          startDateTime: startDateTime.toISOString(),
          endDateTime: endDateTime.toISOString(),
          sessionType,
          studentNotes: notes || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      navigate("/dashboard");
    } catch {
      setSubmitError("Could not reach the server. Is it running on port 3000?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Typography variant="h5">New booking</Typography>

        {optionsError && <Alert severity="error">{optionsError}</Alert>}
        {submitError && <Alert severity="error">{submitError}</Alert>}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3, maxWidth: 400 }}>
          <TextField
            select
            label="Student"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            disabled={loadingOptions}
          >
            {students.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.firstName} {s.lastName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Coach"
            value={coachId}
            onChange={(e) => setCoachId(e.target.value)}
            disabled={loadingOptions}
          >
            {coaches.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.firstName} {c.lastName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Court"
            value={courtId}
            onChange={(e) => setCourtId(e.target.value)}
            disabled={loadingOptions}
          >
            {courts.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.venue.name} — Court {c.number}
              </MenuItem>
            ))}
          </TextField>
          <DateTimePicker
            label="Start"
            value={startDateTime}
            onChange={(value) => setStartDateTime(value)}
          />
          <DateTimePicker
            label="End"
            value={endDateTime}
            onChange={(value) => setEndDateTime(value)}
          />
          <TextField
            select
            label="Session type"
            value={sessionType}
            onChange={(e) => setSessionType(e.target.value as SessionType)}
          >
            <MenuItem value="PRIVATE_LESSON">Private lesson</MenuItem>
            <MenuItem value="GROUP_SESSION">Group session</MenuItem>
          </TextField>
          <TextField
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={3}
          />

          <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Creating…" : "Create booking"}
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
