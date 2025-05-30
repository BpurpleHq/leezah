import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


export interface AuthRequest extends Request {
  user?: { userId: string; role?: string };
}

export const authToken = (req: AuthRequest, res: Response, next: NextFunction) => {
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
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(403).json({ error: 'Token expired', expiredAt: error.expiredAt });
    }
    return res.status(403).json({ error: 'Invalid token' });
  }
};


