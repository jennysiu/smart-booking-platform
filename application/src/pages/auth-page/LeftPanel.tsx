import { Box, Typography } from '@mui/material'

export default function LeftPanel() {
  return (
    <Box>
      <Box>
        <Typography>SB</Typography>
        <Typography>Smart Booking</Typography>
      </Box>

      <Box>
        <Typography>Scheduling that works around your team</Typography>
        <Typography>
          Manage bookings across your team with role-based access for admins, staff, and customers.
        </Typography>
      </Box>

      <Box>
        {[
          { value: '3', label: 'User roles' },
          { value: 'JWT', label: 'Auth standard' },
          { value: 'REST', label: 'API design' },
        ].map(({ value, label }) => (
          <Box key={label}>
            <Typography>{value}</Typography>
            <Typography>{label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}