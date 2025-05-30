"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardModel = void 0;
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const CardSchema = new mongoose_1.Schema({
    cardId: { type: String, default: uuid_1.v4, unique: true },
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    links: [{ type: { type: String, required: true }, url: { type: String, required: true } }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    shareableLink: {
        url: { type: String },
        isActive: { type: Boolean, default: false },
        expiresAt: { type: Date },
    },
    qrCode: { type: String },
});
exports.CardModel = (0, mongoose_1.model)('Card', CardSchema);
