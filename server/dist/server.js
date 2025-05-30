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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth_routes"));
const passport_1 = __importDefault(require("./config/passport"));
const { connectDB } = require('./config/database');
const userRoutes = require('./routes/user_routes');
const CardRoutes = require('./routes/card_routes');
const contactRoutes = require('./routes/contact_routes');
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] Request: ${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    next();
});
app.use(passport_1.default.initialize());
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/cards', CardRoutes);
app.use('/api/v1/contacts', contactRoutes);
app.use('/api/auth', auth_routes_1.default); // Mount auth routes
const PORT = process.env.PORT;
const StartServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectDB();
        app.listen(PORT, () => {
            console.log(`Server running at: http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
    ;
});
StartServer();
