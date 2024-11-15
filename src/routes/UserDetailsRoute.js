const express = require('express');
const router = express.Router();
const UserDetailsController = require('../controllers/UserDetailsController');
const tokenValidator = require('../middlewares/TokenValidator');


router.post('/userdetails', tokenValidator, UserDetailsController.addUserDetails);
router.get('/userdetails/:userId?', tokenValidator, UserDetailsController.getUserDetails);
router.get('/userquestions/:userId?', tokenValidator, UserDetailsController.getUserQuestions);
router.get('/validateAnswers/:userId?', tokenValidator, UserDetailsController.validateAnswers);
router.get('/usercontactpersons/:userId?', tokenValidator, UserDetailsController.getContactPersonsByUserId);

module.exports = router;
