import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth_routes';
import passport from './config/passport';


const {connectDB} = require ('./config/database');
const userRoutes = require ('./routes/user_routes');
const CardRoutes = require ('./routes/card_routes');
const contactRoutes = require ('./routes/contact_routes');



dotenv.config()

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Request: ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  next();
});

app.use(passport.initialize());
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/cards', CardRoutes);
app.use('/api/v1/contacts', contactRoutes);
app.use('/api/auth', authRoutes); // Mount auth routes


const PORT = process.env.PORT;
const StartServer = async () => {
try {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running at: http://localhost:${PORT}`)
    });
}catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);

};
}
StartServer();