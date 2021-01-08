const express = require('express');
const router = new express.Router();
const User = require('../models/user');

router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login', async (req, res) => {
    const foundUser = await User.findOne({email: req.body.email, password: req.body.password}).exec();
    if (foundUser) {
        // Log into the app
    } else {
        res.redirect('/login');
    }
})

router.get('/signup', (req, res) => {
    
})

router.post('/signup', async (req, res) => {
    const newUser = new User(req.body);
    try {
        await newUser.save();
    } catch(error) {
        res.redirect('/login');
    }
})

module.exports = router;