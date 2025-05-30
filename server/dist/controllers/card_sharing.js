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
exports.viewSharedCard = exports.revokeShareableLink = exports.generateShareableLink = void 0;
const Card_1 = require("../models/Card");
const qrcode_1 = __importDefault(require("qrcode"));
const generateShareableLink = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { cardId } = req.params;
    if (!req.user || !req.user.userId) {
        return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
    }
    if (!cardId) {
        return res.status(400).json({ error: 'Card ID is required' });
    }
    try {
        const digitalCard = yield Card_1.CardModel.findOne({ cardId, userId: req.user.userId });
        if (!digitalCard) {
            return res.status(404).json({ error: 'Digital card not found' });
        }
        // Generate shareable link (simplified example)
        const shareableUrl = `https://digital-business-card.onrender.com/card/${cardId}`; // Adjust based on your domain
        digitalCard.shareableLink = {
            url: shareableUrl,
            isActive: true,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiry
        };
        // Generate QR code for the shareable link
        const qrCodeData = yield qrcode_1.default.toDataURL(shareableUrl, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            margin: 1,
        });
        digitalCard.qrCode = qrCodeData;
        digitalCard.updatedAt = new Date();
        yield digitalCard.save();
        return res.status(200).json({
            message: 'Shareable link and QR code generated successfully',
            shareableLink: digitalCard.shareableLink,
            qrCode: qrCodeData,
        });
    }
    catch (error) {
        console.error(`[${new Date().toISOString()}] Error generating shareable link`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.generateShareableLink = generateShareableLink;
// Revoke a shareable link
const revokeShareableLink = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { cardId } = req.params;
    //   const card = await CardModel.findOne({ cardId, userId: req.user?.userId });
    const card = yield Card_1.CardModel.findOne({ cardId });
    if (!card) {
        return res.status(404).json({ error: 'Digital card not found or you do not have permission to revoke its link' });
    }
    if (!card.shareableLink || !card.shareableLink.isActive) {
        return res.status(400).json({ error: 'No active shareable link to revoke' });
    }
    card.shareableLink.isActive = false;
    card.shareableLink.expiresAt = undefined;
    yield card.save();
    res.json({ message: 'Shareable link revoked successfully' });
});
exports.revokeShareableLink = revokeShareableLink;
// Public endpoint to view a shared card
const viewSharedCard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { cardId } = req.params;
    const card = yield Card_1.CardModel.findOne({ cardId });
    if (!card) {
        return res.status(404).json({ error: 'Digital card not found' });
    }
    if (!((_a = card.shareableLink) === null || _a === void 0 ? void 0 : _a.isActive)) {
        return res.status(403).json({ error: 'This card is not shared or the link has been revoked' });
    }
    if (card.shareableLink.expiresAt && new Date() > card.shareableLink.expiresAt) {
        card.shareableLink.isActive = false;
        yield card.save();
        return res.status(403).json({ error: 'This shareable link has expired' });
    }
    res.json({
        title: card.title,
        links: card.links,
        cardId: card.cardId,
    });
});
exports.viewSharedCard = viewSharedCard;
