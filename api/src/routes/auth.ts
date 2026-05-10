import { Router, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma'

const router = Router()

router.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' })
    return
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    res.status(409).json({ error: 'Email already in use' })
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { email, passwordHash }
  })

  res.status(201).json({ id: user.id, email: user.email })
})

export default router