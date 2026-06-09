import { Response, NextFunction } from 'express';
import { AuthRequest } from './authenticate';
import { Role } from '@prisma/client';

export function authorize(...allowedRoles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: 'Unauthorized — no authenticated user' });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({ error: 'Forbidden — insufficient permissions' });
      return;
    }

    next();
  };
}