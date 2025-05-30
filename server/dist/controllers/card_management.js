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
exports.getDigitalCardById = exports.getDigitalCards = exports.deleteDigitalCard = exports.updateDigitalCard = exports.createDigitalCard = void 0;
const Card_1 = require("../models/Card");
const User_1 = require("../models/User");
const uuid_1 = require("uuid");
// Helper function to validate link types based on subscription plan
// const validateLinkTypes = (links: { type: string; url: string }[], subscriptionPlan: string): string | null => {
//   const allowedLinkTypes: { [key: string]: string[] } = {
//     free: ['email', 'phone', 'linkedin'],
//     pro: ['email', 'phone', 'linkedin', 'website', 'twitter'],
//     'pro-plus': ['email', 'phone', 'linkedin', 'website', 'twitter', 'custom'],
//   };
//   const userAllowedLinkTypes = allowedLinkTypes[subscriptionPlan] || allowedLinkTypes.free;
//   for (const link of links) {
//     if (!userAllowedLinkTypes.includes(link.type)) {
//       return `Link type '${link.type}' is not allowed on your plan. Upgrade to access more link types.`;
//     }
//     // Validate URL format (basic check)
//     if (!link.url.match(/^(http|https):\/\/[^ "]+$/)) {
//       return `Invalid URL format for link type '${link.type}': ${link.url}`;
//     }
//   }
//   return null;
// };
// Create a new digital card
const createDigitalCard = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { title, links } = req.body;
    // Input validation
    if (!title || !links || !Array.isArray(links) || links.length === 0) {
        return res.status(400).json({ error: 'Title and at least one link are required' });
    }
    const user = yield User_1.UserModel.findOne({ userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    // Check card limit based on subscription plan
    //   const planLimits: { [key: string]: number } = {
    //     free: 1,
    //     pro: 3,
    //     'pro-plus': 5,
    //   };
    //   const maxCards = planLimits[user.subscription.plan];
    //   const currentCardCount = await DigitalCardModel.countDocuments({ userId: req.user?.userId });
    //   if (currentCardCount >= maxCards) {
    //     return res.status(403).json({
    //       error: `You have reached the maximum number of digital cards for your plan (${maxCards}). Upgrade your plan to create more.`,
    //     });
    //   }
    // Validate link types based on subscription plan
    //   const linkValidationError = validateLinkTypes(links, user.subscription.plan);
    //   if (linkValidationError) {
    //     return res.status(403).json({ error: linkValidationError });
    //   }
    const digitalCard = new Card_1.CardModel({
        cardId: (0, uuid_1.v4)(),
        userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId,
        title,
        links,
    });
    yield digitalCard.save();
    // Log the creation event
    console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'INFO',
        message: 'Digital card created',
        userId: (_c = req.user) === null || _c === void 0 ? void 0 : _c.userId,
        cardId: digitalCard.cardId,
    }));
    res.status(201).json({ message: 'Digital card created successfully', card: digitalCard });
});
exports.createDigitalCard = createDigitalCard;
// Update an existing digital card
const updateDigitalCard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { cardId } = req.params;
    const { title, links } = req.body;
    // At least one field to update is required
    if (!title && (!links || !Array.isArray(links))) {
        return res.status(400).json({ error: 'At least one field (title or links) is required to update' });
    }
    const card = yield Card_1.CardModel.findOne({ cardId, userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId });
    if (!card) {
        return res.status(404).json({ error: 'Digital card not found or you do not have permission to update it' });
    }
    const user = yield User_1.UserModel.findOne({ userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    // Validate link types if links are being updated
    //   if (links) {
    //     const linkValidationError = validateLinkTypes(links, user.subscription.plan);
    //     if (linkValidationError) {
    //       return res.status(403).json({ error: linkValidationError });
    //     }
    //     card.links = links;
    //   }
    if (title)
        card.title = title;
    card.updatedAt = new Date();
    yield card.save();
    // Log the update event
    console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'INFO',
        message: 'Digital card updated',
        userId: (_c = req.user) === null || _c === void 0 ? void 0 : _c.userId,
        cardId: card.cardId,
    }));
    res.json({ message: 'Digital card updated successfully', card });
});
exports.updateDigitalCard = updateDigitalCard;
// Delete a digital card
const deleteDigitalCard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { cardId } = req.params;
    //   const card = await CardModel.findOneAndDelete({ cardId, userId: req.user?.userId });
    const card = yield Card_1.CardModel.findOneAndDelete({ cardId });
    if (!card) {
        return res.status(404).json({ error: 'Digital card not found or you do not have permission to delete it' });
    }
    // Log the deletion event
    console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'INFO',
        message: 'Digital card deleted',
        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
        cardId: card.cardId,
    }));
    res.status(204).send();
});
exports.deleteDigitalCard = deleteDigitalCard;
// Get all digital cards for the user
const getDigitalCards = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const cards = yield Card_1.CardModel.find({ userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId });
    res.json(cards);
});
exports.getDigitalCards = getDigitalCards;
// Get a specific digital card by ID
const getDigitalCardById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { cardId } = req.params;
    const card = yield Card_1.CardModel.findOne({ cardId, userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId });
    if (!card) {
        return res.status(404).json({ error: 'Digital card not found or you do not have permission to view it' });
    }
    res.json(card);
});
exports.getDigitalCardById = getDigitalCardById;
