import { Router } from 'express';
import passport from '../config/passport';
const { googleAuth, googleAuthCallback } = require ('../controllers/g_authcontroller');

const router = Router();

// Route to initiate Google OAuth
router.get('/google', googleAuth);

// Route to handle Google OAuth callback
router.get('/google/callback', passport.authenticate('google', { session: false }), googleAuthCallback);

export default router;