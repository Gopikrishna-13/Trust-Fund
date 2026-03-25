const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 5000 } // Giving every new user $5000 to start
});

module.exports = mongoose.model('User', UserSchema);