import express from "express";
import authRouter from "./routes/auth";
import { authenticate, AuthRequest } from './middleware/authenticate'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/auth", authRouter);

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
