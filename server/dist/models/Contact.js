"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactModel = void 0;
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const contactSchema = new mongoose_1.Schema({
    contactId: { type: String, default: uuid_1.v4, unique: true },
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    company: { type: String },
    jobTitle: { type: String },
    notes: { type: String },
    sourceCardId: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
exports.ContactModel = (0, mongoose_1.model)('Contact', contactSchema);
