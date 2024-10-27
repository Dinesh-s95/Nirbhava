// controllers/UserDetailsController.js
const UserDetails = require('../models/UserDetails');
const AuthUser = require('../models/UserModel'); // Assuming this is the auth schema

exports.addUserDetails = async (req, res) => {
    const { userId, contactPerson, contactPersonPhone, questions } = req.body;

    try {
        // Check if the user exists
        const userExists = await AuthUser.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if details already exist for the user
        const existingDetails = await UserDetails.findOne({ userId });
        if (existingDetails) {
            return res.status(400).json({ message: 'Details already exist for this user' });
        }

        // Save the new details
        const userDetails = new UserDetails({
            userId,
            contactPerson,
            contactPersonPhone,
            questions,
        });
        await userDetails.save();

        res.status(201).json({ message: 'User details added successfully', userDetails });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserDetails = async (req, res) => {
    try {
        const { userId } = req.params;

        // Define the query based on whether a userId is provided
        const query = userId ? { userId } : {};

        // Fetch user details without populating phonenumber
        const userDetails = await UserDetails.find(query);

        // Check if there are user details found
        if (!userDetails.length) {
            return res.status(404).json({ message: userId ? 'User not found' : 'No user details found' });
        }

        // Transform the response to include all fields for each user's details
        const response = userDetails.map(detail => ({
            userId: detail.userId,                  // The userId from UserDetails
            contactPerson: detail.contactPerson,     // UserDetails field
            contactPersonPhone: detail.contactPersonPhone, // UserDetails field
            questions: detail.questions,             // UserDetails field
            createdAt: detail.createdAt,             // UserDetails field
            updatedAt: detail.updatedAt,             // UserDetails field
        }));

        res.status(200).json({ userDetails: response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
