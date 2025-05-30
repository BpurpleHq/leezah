"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userId: { type: String, required: true, default: uuid_1.v4 },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
    jobtitle: { type: String },
    description: { type: String },
    createdAt: { type: Date, timestamps: true },
    updatedAt: { type: Date, timestamps: true },
    googleId: { type: String, unique: true, sparse: true },
});
exports.UserModel = (0, mongoose_1.model)('User', userSchema);
