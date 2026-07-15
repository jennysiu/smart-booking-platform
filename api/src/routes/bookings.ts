import { Router, Response } from "express";
import { Prisma, SessionType } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/authenticate";

const router = Router();

const userSummary = {
  select: { id: true, firstName: true, lastName: true, email: true },
} as const;

// create
router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  const {
    studentId,
    coachId,
    courtId,
    startDateTime,
    endDateTime,
    sessionType,
    focusNotes,
    coachNotes,
    studentNotes,
  } = req.body;

  if (!studentId || !coachId || !courtId || !startDateTime || !endDateTime || !sessionType) {
    res.status(400).json({
      error: "studentId, coachId, courtId, startDateTime, endDateTime and sessionType are required",
    });
    return;
  }

  if (!Object.values(SessionType).includes(sessionType)) {
    res.status(400).json({ error: "Invalid sessionType" });
    return;
  }

  const start = new Date(startDateTime);
  const end = new Date(endDateTime);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
    res.status(400).json({ error: "endDateTime must be after startDateTime" });
    return;
  }

  try {
    const booking = await prisma.booking.create({
      data: {
        createdById: req.user!.userId,
        studentId,
        coachId,
        courtId,
        startDateTime: start,
        endDateTime: end,
        sessionType,
        bookingStatus: "PENDING",
        sessionPrice: 0,
        sessionPaymentStatus: "UNPAID",
        sessionPaymentType: "CASH",
        courtsPrice: 0,
        courtsPaymentStatus: "UNPAID",
        focusNotes,
        coachNotes,
        studentNotes,
      },
      include: { student: userSummary, coach: userSummary, court: true },
    });

    res.status(201).json(booking);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2003") {
      res.status(400).json({ error: "studentId, coachId or courtId does not exist" });
      return;
    }
    throw err;
  }
});

// list
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  const { date } = req.query;

  let dateFilter: Prisma.BookingWhereInput = {};

  if (typeof date === "string") {
    const start = new Date(date);
    if (isNaN(start.getTime())) {
      res.status(400).json({ error: "Invalid date, expected YYYY-MM-DD" });
      return;
    }
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    dateFilter = { startDateTime: { gte: start, lt: end } };
  }

  const bookings = await prisma.booking.findMany({
    where: dateFilter,
    include: { student: userSummary, coach: userSummary, court: true },
    orderBy: { startDateTime: "asc" },
  });

  res.json(bookings);
});

export default router;
