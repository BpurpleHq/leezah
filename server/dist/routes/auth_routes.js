"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("../config/passport"));
const { googleAuth, googleAuthCallback } = require('../controllers/g_authcontroller');
const router = (0, express_1.Router)();
// Route to initiate Google OAuth
router.get('/google', googleAuth);
// Route to handle Google OAuth callback
router.get('/google/callback', passport_1.default.authenticate('google', { session: false }), googleAuthCallback);
exports.default = router;
