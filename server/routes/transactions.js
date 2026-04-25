const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// @route  GET /api/transactions
// @desc   Get all transactions for the logged-in user
// @access Private
router.get('/', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route  POST /api/transactions
// @desc   Create a new transaction record
// @access Private
router.post('/', auth, async (req, res) => {
    const { title, amount, category, type } = req.body;
    try {
        const newTx = new Transaction({
            userId: req.user.id,
            title,
            amount,
            category,
            type,
        });
        const saved = await newTx.save();
        res.status(201).json(saved);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route  DELETE /api/transactions/:id
// @desc   Delete a transaction
// @access Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const tx = await Transaction.findById(req.params.id);
        if (!tx) return res.status(404).json({ msg: 'Transaction not found' });
        if (tx.userId.toString() !== req.user.id)
            return res.status(401).json({ msg: 'Not authorized' });
        await tx.deleteOne();
        res.json({ msg: 'Transaction removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
