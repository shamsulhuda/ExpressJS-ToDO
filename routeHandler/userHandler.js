const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

const userSchema = require('../schemas/userSchema');

// Create a model
const User = new mongoose.model('User', userSchema);

// Get all TODOs
router.post('/signup', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
        name: req.body.name,
        username: req.body.username,
        password: hashedPassword
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
            username: req.body.username
        });
        if(user && user.length > 0){
            for (let index = 0; index < user.length; index++) {
                let myuser = user[index];
                if(await bcrypt.compare(req.body.password, myuser.password)){
                    // Generate token
                    const token = jwt.sign({
                        username: myuser.username,
                        userId: myuser._id
                    }, process.env.JWT_SECRET, {
                        expiresIn: '1h'
                    });
                    res.status(200).json({
                        "access_token": token,
                        "user": myuser.username,
                        "message": "Login successfull!"
                    });
                }else{
                    res.status(401).json({
                        "error": "Authentication failed!"
                    })
                }
            }
        }else{
            res.status(401).json({
                "error": "Authentication failed"
            })
        }
    } catch {
        res.status(401).json({
            "error": "Authentication failed"
        })
    }
})


module.exports = router;
