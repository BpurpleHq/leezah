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
exports.deleteContact = exports.getContacts = exports.saveContact = void 0;
// import { AuthRequest } from '../middleware/authMiddleware';
const Contact_1 = require("../models/Contact");
const User_1 = require("../models/User");
const uuid_1 = require("uuid");
// Save a contact via a form
const saveContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, name, email, phone, company, jobTitle, notes, sourceCardId } = req.body;
    if (!name || !phone) {
        return res.status(400).json({ error: 'Name and Phonenumber are required' });
    }
    const user = yield User_1.UserModel.findOne({});
    //   const user = await UserModel.findOne({ userId: req.user?.userId });
    //   if (!user) {
    //     return res.status(404).json({ error: 'User not found' });
    //   }
    // Enforce contact limits based on subscription plan
    //   const planLimits: { [key: string]: number } = {
    //     free: 5,
    //     pro: Infinity, // Unlimited
    //     'pro-plus': Infinity, // Unlimited
    //   };
    //   const maxContacts = planLimits[user.subscription.plan];
    const currentContactCount = yield Contact_1.ContactModel.countDocuments({});
    //   if (currentContactCount >= maxContacts) {
    //     return res.status(403).json({
    //       error: `You have reached the maximum number of contacts for your plan (${maxContacts}). Upgrade your plan to save more.`,
    //     });
    //   }
    const contact = new Contact_1.ContactModel({
        contactId: (0, uuid_1.v4)(),
        userId,
        name,
        email,
        phone,
        company,
        jobTitle,
        notes,
        sourceCardId,
    });
    yield contact.save();
    res.status(201).json({ message: 'Contact saved successfully', contact });
});
exports.saveContact = saveContact;
// Get the user's contact list
const getContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.UserModel.findOne({});
    //   const user = await UserModel.findOne({ userId: req.user?.userId });
    //   if (!user) {
    //     return res.status(404).json({ error: 'User not found' });
    //   }
    //   const isFreePlan = user.subscription.plan === 'free';
    const query = Contact_1.ContactModel.find({}).sort({ createdAt: -1 });
    //   if (isFreePlan) {
    //     query.limit(5); // Free plan: only the 5 most recent contacts
    //   }
    const contacts = yield query.exec();
    res.json(contacts);
});
exports.getContacts = getContacts;
// Delete a contact
const deleteContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contactId } = req.params;
    const contact = yield Contact_1.ContactModel.findOneAndDelete({ contactId });
    //   const contact = await ContactModel.findOneAndDelete({ contactId, userId: req.user?.userId });
    if (!contact) {
        return res.status(404).json({ error: 'Contact not found or you do not have permission to delete it' });
    }
    res.status(204).send();
});
exports.deleteContact = deleteContact;
