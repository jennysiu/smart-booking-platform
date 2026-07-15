import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";

type SessionType = "PRIVATE_LESSON" | "GROUP_SESSION";

export default function NewBookingPage() {
  const [student, setStudent] = useState("");
  const [coach, setCoach] = useState("");
  const [court, setCourt] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [sessionType, setSessionType] = useState<SessionType>("PRIVATE_LESSON");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    // TODO: wire up to POST /bookings once the API endpoint exists
  };

  return (
    <Box>
      <Typography variant="h5">New booking</Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3, maxWidth: 400 }}>
        <TextField
          label="Student"
          value={student}
          onChange={(e) => setStudent(e.target.value)}
        />
        <TextField
          label="Coach"
          value={coach}
          onChange={(e) => setCoach(e.target.value)}
        />
        <TextField
          label="Court"
          value={court}
          onChange={(e) => setCourt(e.target.value)}
        />
        <TextField
          label="Start"
          type="datetime-local"
          value={startDateTime}
          onChange={(e) => setStartDateTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End"
          type="datetime-local"
          value={endDateTime}
          onChange={(e) => setEndDateTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
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

        <Button variant="contained" onClick={handleSubmit}>
          Create booking
        </Button>
      </Box>
    </Box>
  );
}
