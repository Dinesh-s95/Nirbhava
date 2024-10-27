const express = require('express');
const router = express.Router();
const UserDetailsController = require('../controllers/UserDetailsController');
const tokenValidator = require('../middlewares/TokenValidator');


router.post('/userdetails', tokenValidator, UserDetailsController.addUserDetails);
router.get('/userdetails/:userId?', tokenValidator, UserDetailsController.getUserDetails);

module.exports = router;
