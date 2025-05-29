const mongoose = require('mongoose');


const dbURL = process.env.MONGODB_URI
export const connectDB = async () => {
      try{ await mongoose.connect(dbURL, {authSource: 'admin'}),
            console.log('✅ MongoDB Connected');

    } catch (error) {
        console.error('❌ Connection Error:', error);
        setTimeout(connectDB, 5000); 
    }
};
