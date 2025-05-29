import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Add this declaration to extend the Request interface globally
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string };
    }
  }
}

export const authToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized! Missing token' });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    req.user = { userId: decode.userId };
    
    console.log(`[${new Date().toISOString()}] Protected route access method: ${req.method}, Path: ${req.path}, UserId: ${decode.userId}`);
    
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};


