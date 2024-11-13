const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

// Sign-up Controller
exports.signup = async (req, res) => {
    const { username, password, phonenumber } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const user = new User({ username, password, phonenumber });
        await user.save();
        res.status(201).json({ message: 'User registered successfully', userId: user._id });
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Return a validation error message
            return res.status(400).json({ message: 'Validation failed', details: error.errors });
        }
        // General server error response
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Sign-in Controller
exports.signin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            // User not found
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Check if the password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, userId: user._id });
    } catch (error) {
        // General server error response
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
