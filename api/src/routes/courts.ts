import { Router, Response } from "express";
import { prisma } from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/authenticate";

const router = Router();

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  const courts = await prisma.court.findMany({
    include: { venue: true },
    orderBy: [{ venue: { name: "asc" } }, { number: "asc" }],
  });

  res.json(courts);
});

export default router;
