    const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');

function createSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

// GET /api/campaigns
// Default: only approved campaigns
// Use /api/campaigns?status=all to get pending + approved + rejected
router.get('/', async (req, res) => {
    try {
        const { status } = req.query;

        let filter = { status: 'approved' };

        if (status === 'all') {
            filter = {};
        } else if (status) {
            filter = { status };
        }

        const campaigns = await Campaign.find(filter).sort({ createdAt: -1 });
        res.json(campaigns);
    } catch (err) {
        console.error('Get campaigns error:', err.message);
        res.status(500).json({ msg: 'Server error while fetching campaigns' });
    }
});

// GET /api/campaigns/:id
// id can be MongoDB _id or slug
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const campaign = await Campaign.findOne({
            $or: [
                { slug: id },
                ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])
            ]
        });

        if (!campaign) {
            return res.status(404).json({ msg: 'Campaign not found' });
        }

        res.json(campaign);
    } catch (err) {
        console.error('Get campaign error:', err.message);
        res.status(500).json({ msg: 'Server error while fetching campaign' });
    }
});

// POST /api/campaigns
// Creates campaign with pending status
router.post('/', async (req, res) => {
    try {
        const { title, goal, description, wallet, tag, tagColor } = req.body;

        if (!title || !goal || !description || !wallet) {
            return res.status(400).json({
                msg: 'Title, goal, description and wallet are required'
            });
        }

        const baseSlug = createSlug(title);
        const slug = `${baseSlug}-${Date.now()}`;

        const campaign = new Campaign({
            title,
            slug,
            goal: Number(goal),
            description,
            wallet,
            tag: tag || 'IMPACT',
            tagColor: tagColor || 'secondary',
            status: 'pending'
        });

        const savedCampaign = await campaign.save();

        res.status(201).json({
            msg: 'Campaign submitted for verification',
            campaign: savedCampaign
        });
    } catch (err) {
        console.error('Create campaign error:', err.message);
        res.status(500).json({ msg: 'Server error while creating campaign' });
    }
});

// PATCH /api/campaigns/:id/status
// Manager/Admin can approve or reject campaign
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ msg: 'Invalid campaign status' });
        }

        const campaign = await Campaign.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!campaign) {
            return res.status(404).json({ msg: 'Campaign not found' });
        }

        res.json({
            msg: `Campaign ${status}`,
            campaign
        });
    } catch (err) {
        console.error('Update status error:', err.message);
        res.status(500).json({ msg: 'Server error while updating status' });
    }
});

// PATCH /api/campaigns/:id/donate
// Updates raised amount and donor history
router.patch('/:id/donate', async (req, res) => {
    try {
        const { amount, address, paymentMethod, txHash } = req.body;

        if (!amount || !address) {
            return res.status(400).json({ msg: 'Amount and donor address are required' });
        }

        const campaign = await Campaign.findOne({
            $or: [
                { slug: req.params.id },
                ...(req.params.id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: req.params.id }] : [])
            ]
        });

        if (!campaign) {
            return res.status(404).json({ msg: 'Campaign not found' });
        }

        campaign.raised = Number(campaign.raised) + Number(amount);

        campaign.donors.unshift({
            address,
            amount: Number(amount),
            paymentMethod: paymentMethod || 'crypto',
            txHash: txHash || ''
        });

        await campaign.save();

        res.json({
            msg: 'Donation recorded successfully',
            campaign
        });
    } catch (err) {
        console.error('Donation update error:', err.message);
        res.status(500).json({ msg: 'Server error while recording donation' });
    }
});

module.exports = router;