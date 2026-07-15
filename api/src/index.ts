import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import bookingsRouter from "./routes/bookings";
import usersRouter from "./routes/users";
import courtsRouter from "./routes/courts";
import { authenticate, AuthRequest } from './middleware/authenticate'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use("/auth", authRouter);
app.use("/bookings", bookingsRouter);
app.use("/users", usersRouter);
app.use("/courts", courtsRouter);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get('/me', authenticate, (req: AuthRequest, res) => {
  res.json({ user: req.user })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
