// controllers/UserDetailsController.js
const UserDetails = require('../models/UserDetails');
const AuthUser = require('../models/UserModel'); // Assuming this is the auth schema

exports.addUserDetails = async (req, res) => {
    const { userId, contactPersons, questions } = req.body;

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
            contactPersons,
            // contactPersonPhone,
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
            contactPersons: detail.contactPersons,     // UserDetails field
            // contactPersonPhone: detail.contactPersonPhone, // UserDetails field
            questions: detail.questions,             // UserDetails field
            createdAt: detail.createdAt,             // UserDetails field
            updatedAt: detail.updatedAt,             // UserDetails field
        }));

        res.status(200).json({ userDetails: response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// controllers/UserDetailsController.js
exports.getUserQuestions = async (req, res) => {
    try {
        const { userId } = req.params;

        // Define the query based on whether a userId is provided
        const query = userId ? { userId } : {};

        // Fetch only the questions field for the specified user(s)
        const questionsData = await UserDetails.find(query, 'userId questions');

        // Check if there are any questions found
        if (!questionsData.length) {
            return res.status(404).json({ message: userId ? 'User not found' : 'No questions found' });
        }

        // Flatten the response to include only the userId and questions (question and _id)
        const response = questionsData.map(detail => ({
            userId: detail.userId,
            questions: detail.questions.map(q => ({
                question: q.question,
                _id: q._id
            }))
        }));

        // If only a single user is queried, return just the object instead of an array
        if (userId) {
            return res.status(200).json(response[0]);
        }

        // For multiple users, return an array of responses
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// controllers/UserDetailsController.js
exports.validateAnswers = async (req, res) => {
    const { userId, answers } = req.body;  // answers is an array of { questionId, answer }

    try {
        // Fetch the user's details and questions
        const userDetails = await UserDetails.findOne({ userId });

        // Check if user details exist
        if (!userDetails) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Flag to track if all answers match
        let allAnswersCorrect = true;

        // Loop through the answers passed from the frontend
        for (const userAnswer of answers) {
            // Find the question in the stored questions array
            const question = userDetails.questions.find(q => q._id.toString() === userAnswer.questionId);

            // If question not found or answer doesn't match
            if (!question || question.answer !== userAnswer.answer) {
                allAnswersCorrect = false;
                break;
            }
        }

        // If all answers match
        if (allAnswersCorrect) {
            return res.status(200).json({ message: 'All answers are correct' });
        } else {
            return res.status(400).json({ message: 'Some answers are incorrect' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// controllers/UserDetailsController.js

// New API to fetch contact persons for a given userId
exports.getContactPersonsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        // Check if userId is provided
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Fetch only the contactPersons field for the specified user
        const userContactPersons = await UserDetails.findOne({ userId }, 'userId contactPersons');

        // Check if the user details exist
        if (!userContactPersons) {
            return res.status(404).json({ message: 'User not found or no contact persons available' });
        }

        // Format the response to include userId and contact person details (name and phone)
        const response = {
            userId: userContactPersons.userId,
            contactPersons: userContactPersons.contactPersons.map(cp => ({
                name: cp.name,
                phone: cp.phone
            }))
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

