const mongoose = require('mongoose');

const DonorSchema = new mongoose.Schema(
    {
        address: { type: String, required: true },
        amount: { type: Number, required: true },
        paymentMethod: { type: String, enum: ['crypto', 'fiat'], default: 'crypto' },
        txHash: { type: String, default: '' },
        donatedAt: { type: Date, default: Date.now }
    },
    { _id: false }
);

const CampaignSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        wallet: { type: String, required: true },
        raised: { type: Number, default: 0 },
        goal: { type: Number, required: true },
        tag: { type: String, default: 'IMPACT' },
        tagColor: { type: String, default: 'secondary' },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
        donors: [DonorSchema]
    },
    { timestamps: true }
);

CampaignSchema.virtual('link').get(function () {
    return `/impact/${this.slug}`;
});

CampaignSchema.set('toJSON', { virtuals: true });
CampaignSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Campaign', CampaignSchema);
