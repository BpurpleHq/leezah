import express from 'express';
import dotenv from 'dotenv';

const {connectDB} = require ('./config/database');
const userRoutes = require ('./routes/user_routes');
const CardRoutes = require ('./routes/card_routes');
const contactRoutes = require ('./routes/contact_routes');

dotenv.config()

const app = express();
app.use(express.json());


app.use('/api/v1/users', userRoutes);
app.use('/api/v1/cards', CardRoutes);
app.use('/api/v1/contacts', contactRoutes);

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