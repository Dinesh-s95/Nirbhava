const mongoose = require('mongoose');
const connectDB = async () => {
    const DB_CONNECTION = 'DB_SECRET_PLACEHOLDER'
    try {
        await mongoose.connect(DB_CONNECTION, {
            useNewUrlParser: true
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message + "Could not connect to DB");
        process.exit(1);
    }
};

module.exports = connectDB;
