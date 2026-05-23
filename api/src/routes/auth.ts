import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import jwt from "jsonwebtoken";
import crypto from "crypto"
import {authenticate, AuthRequest} from "../middleware/authenticate";

const router = Router();

// register
router.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ error: "Email already in use" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, passwordHash },
  });

  res.status(201).json({ id: user.id, email: user.email });
});

// login
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" },
  );

  const refreshToken = crypto.randomBytes(64).toString("hex");

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 25 * 60 * 60 * 1000),
    }
  })

  res.json({ accessToken , refreshToken});
});

router.post("/refresh", async (reg: Request, res: Response) => {
  const { refreshToken } = reg.body;

  if (!refreshToken) {
    res.status(400).json({error: "Refresh token expired"})
    return
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: {user: true} });

  if (!stored || stored.expiresAt < new Date()) {
    res.status(401).json({ error: "Invalid or expired refresh token expired" });
    return
  }

  // delete old refresh token
  await prisma.refreshToken.delete({where: {token: refreshToken }});

  // generate new refresh token
  const newRefreshToken = crypto.randomBytes(64).toString("hex");

  // add to DB
  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: stored.userId,
      expiresAt: new Date(Date.now() + 7 * 25 * 60 * 60 * 1000),
    }
  })

  const accessToken = jwt.sign(
      { userId: stored.userId, role: stored.user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" },
  )

  res.json({ accessToken, refreshToken, newRefreshToken });
})

router.post("/logout", authenticate, async (req: AuthRequest, res: Response) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    // delete refresh token
  try {
    await prisma.refreshToken.delete({where: {token: refreshToken }});
  } catch (error) {
    console.warn("Logout: refresh token not found or already deleted", error);
  }
    res.json({message: "Logged out"})
  }
})

export default router;
