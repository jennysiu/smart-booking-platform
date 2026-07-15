import { Box, Typography, Card } from "@mui/material";

const stats = [
  { label: "Today's bookings", value: "—" },
  { label: "Overdue Payments", value: "—" },
  { label: "Cancelled", value: "—" },
  { label: "Revenue", value: "—" },
];

export default function StatsCards() {
  return (
    <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
      {stats.map(({ label, value }) => (
        <Card key={label} sx={{ p: 2, flex: 1 }}>
          <Typography variant="body2">{label}</Typography>
          <Typography variant="h6">{value}</Typography>
        </Card>
      ))}
    </Box>
  );
}
