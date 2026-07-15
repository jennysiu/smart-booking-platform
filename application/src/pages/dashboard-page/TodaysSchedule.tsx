import { Box, Typography, Card } from "@mui/material";

export default function TodaysSchedule() {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">Today's schedule</Typography>
      <Card sx={{ p: 2, mt: 1 }}>
        <Typography variant="body2">No bookings scheduled for today.</Typography>
      </Card>
    </Box>
  );
}
