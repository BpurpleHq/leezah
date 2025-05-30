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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const User_1 = require("../models/User");
const uuid_1 = require("uuid");
passport_1.default.serializeUser((user, done) => {
    done(null, user.userId);
});
passport_1.default.deserializeUser((userId, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.UserModel.findOne({ userId });
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
}));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: "353249939213-hscm0f9v5e92gq4rjail8la43ojv69u5.apps.googleusercontent.com",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email'], // Request profile and email scopes
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        // Find or create the user based on Google profile
        let user = yield User_1.UserModel.findOne({ email: (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value });
        if (!user) {
            // Create a new user if they don't exist
            user = new User_1.UserModel({
                userId: (0, uuid_1.v4)(),
                firstName: ((_c = profile.name) === null || _c === void 0 ? void 0 : _c.givenName) || 'Unknown',
                lastName: ((_d = profile.name) === null || _d === void 0 ? void 0 : _d.familyName) || 'User',
                email: (_f = (_e = profile.emails) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.value,
                password: '', // No password needed for OAuth users
                googleId: profile.id, // Store Google ID for future lookups
            });
            yield user.save();
        }
        done(null, user);
    }
    catch (error) {
        done(error);
    }
})));
exports.default = passport_1.default;
