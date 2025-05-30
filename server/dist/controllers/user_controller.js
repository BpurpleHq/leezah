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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.getAllUsers = exports.getUserById = exports.deleteUser = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Register User
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstname, lastname, email, password } = req.body;
        if (!email || !firstname || !lastname || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const existingUser = yield User_1.UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 14);
        const userId = (0, uuid_1.v4)().replace(/-/g, '');
        const user = new User_1.UserModel({
            userId,
            firstname,
            lastname,
            email,
            password: hashedPassword,
            createdAt: Date.now()
        });
        yield user.save();
        const userResponse = {
            userId: user.userId,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            createdAt: user.createdAt,
        };
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: userResponse,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.registerUser = registerUser;
//LoginUser
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const user = yield User_1.UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password.toString());
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.userId, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                userId: user.userId,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.loginUser = loginUser;
// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
// const JWT_EXPIRES_IN = '1h'; 
// export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       res.status(400).json({ error: 'Email and password are required' });
//       return;
//     }
//     // Find user by email
//     const user = await UserModel.findOne({ email });
//     if (!user) {
//       res.status(401).json({ error: 'Invalid email or password' });
//       return;
//     }
//     // Compare password
//     const isPasswordValid = await bcrypt.compare(password, user.password.toString());
//     if (!isPasswordValid) {
//       res.status(401).json({ error: 'Invalid email or password' });
//       return;
//     }
//     // Create JWT payload
//     const payload = {
//       userId: user.userId,
//       email: user.email,
//     };
//     // Sign token
//     const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
//     res.json({ token });
//     res.status(200).json({
//       success: true,
//       message: 'Login successful',
//       token,
//       user: {
//         userId: user.userId,
//         firstname: user.firstname,
//         lastname: user.lastname,
//         email: user.email,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };
//DeleteUSer
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const deletedUser = yield User_1.UserModel.findOneAndDelete({ userId });
        if (!deletedUser) {
            res.status(404).json({ success: false, message: `User with ID ${userId} not found` });
            return;
        }
        res.status(200).json({
            success: true,
            message: `User with ID ${userId} deleted successfully`,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUser = deleteUser;
// Get User By ID
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield User_1.UserModel.findOne({ userId }).select('-password -__v').lean();
        if (!user) {
            return res.status(404).json({ success: false, message: `User with ID ${userId} not found` });
        }
        return res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        next(error);
    }
});
exports.getUserById = getUserById;
// Get All Users
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.UserModel.find().select('-password -__v').lean();
        return res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllUsers = getAllUsers;
// Update User Profile
const updateUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const { jobtitle, company, phone, description } = req.body;
    try {
        const updateData = {};
        if (jobtitle)
            updateData.jobtitle = jobtitle;
        if (company)
            updateData.company = company;
        if (phone)
            updateData.phone = phone;
        if (description)
            updateData.description = description;
        // Add updatedAt timestamp inside $set
        const updatedUser = yield User_1.UserModel.findOneAndUpdate({ userId }, { $set: Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }) }, { new: true, select: '-password -__v' }).lean();
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateUserProfile = updateUserProfile;
