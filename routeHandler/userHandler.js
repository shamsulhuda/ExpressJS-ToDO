const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

const userSchema = require('../schemas/userSchema');
const { route } = require('./todoHandler');

// Create a model
const User = new mongoose.model('User', userSchema);

// Get all TODOs
router.post('/signup', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
        name: req.body.name,
        username: req.body.username,
        password: hashedPassword,
    });
    await newUser
        .save()
        .then(() => {
            res.status(200).json({
                message: 'User created successfully!',
            });
        })
        .catch(() => {
            res.status(500).json({
                err: 'Something is wrong on server side!',
            });
        });
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.find({
            username: req.body.username,
        });
        if (user && user.length > 0) {
            const isValidPassword = await bcrypt.compare(req.body.password, user[0].password);
            if (isValidPassword) {
                // Generate token
                const token = jwt.sign(
                    {
                        username: user[0].username,
                        userId: user[0]._id,
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: '1h',
                    }
                );
                res.status(200).json({
                    access_token: token,
                    message: 'Login successfull!',
                });
            } else {
                res.status(401).json({
                    error: 'Authentication failed!',
                });
            }
        } else {
            res.status(401).json({
                error: 'Authentication failed',
            });
        }
    } catch {
        res.status(401).json({
            error: 'Authentication failed',
        });
    }
});

router.get('/all', async (req, res) => {
    try {
        const users = await User.find({
            status: 'active',
        }).populate('todos');

        res.status(200).json({
            message: 'Success!',
            data: users,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: 'Something is happened on server side!',
        });
    }
});
module.exports = router;
