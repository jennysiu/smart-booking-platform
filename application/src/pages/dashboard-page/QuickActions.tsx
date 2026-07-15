import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const quickActions = [
  { label: "New booking", path: "/bookings/new" },
  { label: "View calendar", path: null },
  { label: "Settings", path: null },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">Quick actions</Typography>
      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        {quickActions.map(({ label, path }) => (
          <Button
            key={label}
            variant="outlined"
            disabled={!path}
            onClick={() => path && navigate(path)}
          >
            {label}
          </Button>
        ))}
      </Box>
    </Box>
  );
}
