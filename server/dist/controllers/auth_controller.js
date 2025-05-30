"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = void 0;
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Your implementation
        res.status(201).json({ message: 'User created' });
    }
    catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});
exports.signUp = signUp;
// import { Request, Response } from 'express';
// import User from '../models/User';
// import { generateToken } from '../utils/jwtoken';
// export const signUp = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         error: 'Email already exists'
//       });
//     }
//     const user = await User.create({ email, password });
//     const token = generateToken(user.id);
//     res.status(201).json({
//       success: true,
//       data: {
//         id: user.id,
//         email: user.email,
//         token
//       }
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       error: 'Registration failed'
//     });
//   }
// };
// export const signIn = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email }).select('+password');
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         error: 'Invalid credentials'
//       });
//     }
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         error: 'Invalid credentials'
//       });
//     }
//     const token = generateToken(user.id);
//     res.json({
//       success: true,
//       data: {
//         id: user.id,
//         email: user.email,
//         token
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: 'Authentication failed'
//     });
//   }
// };
