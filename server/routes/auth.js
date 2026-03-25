const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Import the User model we made earlier
const auth = require('../middleware/auth'); // Add this near your other imports

// @route   POST api/auth/register
// @desc    Register a new user (Open a bank account)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        // 2. Create new user instance
        user = new User({ name, email, password });

        // 3. Hash (Encrypt) the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 4. Save to Database
        await user.save();
        
        res.status(201).json({ msg: "Account created successfully!", balance: user.balance });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

const jwt = require('jsonwebtoken');

// @route   POST api/auth/login
// @desc    Authenticate user & get token (Login)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if the user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid Credentials (User not found)" });
        }

        // 2. Check if the password matches
        // We compare the typed password with the encrypted one in the DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid Credentials (Wrong password)" });
        }

        // 3. Create a JWT Token
        const payload = {
            user: { id: user.id }
        };

        // 4. Sign the token and send it to the user
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' }, // User stays logged in for 24 hours
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    token, 
                    user: { id: user.id, name: user.name, balance: user.balance } 
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   GET api/auth/me
// @desc    Get logged-in user's data (Balance, Name, etc.)
router.get('/me', auth, async (req, res) => {
    try {
        // Find the user by the ID inside the token, but DON'T send the password back!
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;