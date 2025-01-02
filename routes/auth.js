const express = require('express');
const router = express.Router();
const { register,verifyEmail, addPassword,login, logout,protectedCheck} = require('../controllers/authController');
const { verify } = require('crypto');
const auth = require('../middleware/auth');

// Register a new user
router.post('/register', register);

//verify email 
router.post('/verifyEmail', verifyEmail);

// Add Password 
router.post('/addpassword',addPassword);
            
//login
router.post('/login', login);

// Logout a user
router.post('/logout', logout);

//Protected routes check 

router.get('/protected', auth ,protectedCheck);

module.exports = router;