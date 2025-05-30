"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuthCallback = exports.googleAuth = void 0;
const passport_1 = __importDefault(require("../config/passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Initiate Google OAuth login
exports.googleAuth = passport_1.default.authenticate('google', {
    scope: ['profile', 'email'],
});
// Google OAuth callback
const googleAuthCallback = (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ error: 'Authentication failed' });
    }
    // Generate JWT token for your app
    const token = jsonwebtoken_1.default.sign({ userId: user.userId }, process.env.JWT_SECRET, {
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
exports.googleAuthCallback = googleAuthCallback;
