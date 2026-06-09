const mongoose = require('mongoose');

global.dbConnected = false;

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn('⚠️ WARNING: MONGO_URI not defined in environment. Running in mockup in-memory mode.');
    global.dbConnected = false;
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
    global.dbConnected = true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ Running in mockup in-memory mode due to database connection failure.');
    global.dbConnected = false;
  }
};

module.exports = connectDB;
