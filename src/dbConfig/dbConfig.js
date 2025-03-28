import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection;

    db.on('connected', () => {
      console.log('MongoDB Connected');
    });

    db.on('error', (error) => {
      console.error(`Database connection error: ${error.message}`);
      process.exit(1); // Exit process with failure
    });

    db.on('disconnected', () => {
      console.log('MongoDB Disconnected');
    });
  } catch (error) {
    console.error(`something went wrong while Mongodb connection error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;