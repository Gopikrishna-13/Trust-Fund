const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// @route   POST api/transactions
// @desc    Add a new transaction (Income or Expense)
router.post('/', auth, async (req, res) => {
    try {
        const { title, amount, category, type } = req.body;

        // 1. Create the transaction
        const newTransaction = new Transaction({
            userId: req.user.id,
            title,
            amount,
            category,
            type
        });

        const transaction = await newTransaction.save();

        // 2. Update the User's Balance in the Database
        const user = await User.findById(req.user.id);
        if (type === 'income') {
            user.balance += Number(amount);
        } else {
            user.balance -= Number(amount);
        }
        await user.save();

        res.json({ transaction, newBalance: user.balance });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/transactions
// @desc    Get all transactions for the logged-in user
router.get('/', auth, async (req, res) => {
    try {
        // Find transactions where the userId matches the person logged in
        const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;