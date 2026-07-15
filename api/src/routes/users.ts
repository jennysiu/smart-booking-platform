import { Router, Response } from "express";
import { Role } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/authenticate";

const router = Router();

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  const { role } = req.query;

  if (role && !Object.values(Role).includes(role as Role)) {
    res.status(400).json({ error: "Invalid role" });
    return;
  }

  const users = await prisma.user.findMany({
    where: role ? { role: role as Role } : {},
    select: { id: true, firstName: true, lastName: true, email: true, role: true },
    orderBy: { firstName: "asc" },
  });

  res.json(users);
});

export default router;
