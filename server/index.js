require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Add this line

const app = express();

app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(" Bank Database Connected"))
    .catch(err => console.error(" Database Connection Error:", err.message));

// --- UPDATED ROUTE PATH ---
// This uses 'path' to make sure the server finds the file correctly on Windows
const authRoutes = require(path.join(__dirname, 'routes', 'auth'));
app.use('/api/auth', authRoutes);

// Add this line below your app.use('/api/auth', ...)
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/campaigns', require('./routes/campaigns'));
app.get('/', (req, res) => {
    res.send("Banking Server is Running!");
});

const PORT = 5000;
app.listen(PORT, () => console.log(` Server started on port ${PORT}`));