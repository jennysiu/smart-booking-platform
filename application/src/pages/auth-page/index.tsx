import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useAuth } from "./useAuth";

export default function AuthPage() {
  const {
    mode,
    email,
    password,
    confirmPassword,
    loading,
    error,
    success,
    setEmail,
    setPassword,
    setConfirmPassword,
    reset,
    handleSubmit,
  } = useAuth();

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <Box>
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={(_, val) => val && reset(val)}
      >
        <ToggleButton value="login">Sign in</ToggleButton>
        <ToggleButton value="register">Create account</ToggleButton>
      </ToggleButtonGroup>

      <Typography variant="h5">
        {mode === "login" ? "Welcome back" : "Get started"}
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Box>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="email"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete={
            mode === "login" ? "current-password" : "new-password"
          }
        />
        {mode === "register" && (
          <TextField
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="new-password"
          />
        )}

        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading
            ? "Please wait…"
            : mode === "login"
              ? "Sign in"
              : "Create account"}
        </Button>
      </Box>

      <Typography variant="body2">
        {mode === "login"
          ? "Don't have an account?"
          : "Already have an account?"}
        <Button
          variant="text"
          onClick={() => reset(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "Create one" : "Sign in"}
        </Button>
      </Typography>
    </Box>
  );
}
