const mongoose = require('mongoose');



export const connectDB = async () => {
      try{ 
        const dbURL = process.env.MONGODB_URI
        await mongoose.connect(dbURL, {authSource: 'admin'}),
            console.log('✅ MongoDB Connected');

    } catch (error) {
        console.error('❌ Connection Error:', error);
        setTimeout(connectDB, 5000); 
    }
};
