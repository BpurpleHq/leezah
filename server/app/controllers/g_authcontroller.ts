import { Request, Response } from 'express';
import passport from '../config/passport';
import jwt from 'jsonwebtoken';

// Initiate Google OAuth login
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

// Google OAuth callback
export const googleAuthCallback = (req: Request, res: Response) => {
  const user = req.user as any;

  if (!user) {
    return res.status(401).json({ error: 'Authentication failed' });
  }

  // Generate JWT token for your app
  const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET as string, {
    expiresIn: '1d',
  });

  // Log the successful login
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'INFO',
    message: 'User logged in via Google OAuth',
    userId: user.userId,
    email: user.email,
  }));

  // Redirect to frontend with the token (or send it in the response)
  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
};