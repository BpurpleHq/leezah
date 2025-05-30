"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && (authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1]);
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized! Missing token' });
    }
    try {
        const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decode.userId };
        console.log(`[${new Date().toISOString()}] Protected route access method: ${req.method}, Path: ${req.path}, UserId: ${decode.userId}`);
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(403).json({ error: 'Token expired', expiredAt: error.expiredAt });
        }
        return res.status(403).json({ error: 'Invalid token' });
    }
};
exports.authToken = authToken;
