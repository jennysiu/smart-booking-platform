import { Box, Typography } from "@mui/material";
import StatsCards from "./StatsCards";
import TodaysSchedule from "./TodaysSchedule";
import QuickActions from "./QuickActions";

export default function DashboardPage() {
  return (
    <Box>
      <Typography variant="h5">Welcome back, name !</Typography>

      <StatsCards />
      <TodaysSchedule />
      <QuickActions />
    </Box>
  );
}
