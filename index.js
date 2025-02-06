require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const User = require('./schema');
const { resolve } = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static('static'));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to database'))
.catch(err => console.error('Error connecting to database:', err));

app.get('/', (req, res) => {
    res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.post('/api/users', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Validation error: Missing required fields' });
        }
        
        const user = new User({ name, email, password });
        await user.save();
        
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
