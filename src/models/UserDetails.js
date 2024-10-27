// models/UserDetails.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserDetailsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'AuthUsers', // This references the AuthUser schema
        required: true,
        unique: true,
    },
    contactPerson: {
        type: String,
        required: true,
    },
    contactPersonPhone: {
        type: String,
        required: true,
    },
    questions: [
        {
            question: String,
            answer: String,
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model('UserDetails', UserDetailsSchema);
