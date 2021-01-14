const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const Team = require('../models/team');

router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login', async (req, res) => {
    try {
        const foundUser = await User.findByCredentials(req.body.email, req.body.password);
        
        if (foundUser) {
            req.session.name = foundUser.name;
            req.session.teamCode = foundUser.teamCode;
            res.redirect('/home');
        } else {
            res.redirect('/login');
        }
    } catch(e) {
        // Server error 500
    }    
})

router.get('/signup', (req, res) => {
    
})

router.post('/signup', async (req, res) => {
    // TODO: Validate user input
    // TODO: Validate user and team don't exist before creating them
    try {
        const newUser = await new User(req.body);
        newUser.makerSince = new Date();
        if (req.body.teamName) {
            // Signup for user and new team
            const newTeam = await new Team({teamName: req.body.teamName,
                                            members: [newUser]});
            newTeam.teamCode = await Team.generateTeamCode();
            newUser.teamCode = newTeam.teamCode;
            await newTeam.save();     
        } else {
            // Signup to existing team
            const foundTeam = await Team.findOne({teamCode: req.body.teamCode}).exec();
            console.log(foundTeam);
            const updatedMembers = foundTeam.members;
            updatedMembers.push(newUser);
            if (foundTeam) {
                const test = await Team.findOneAndUpdate({_id: foundTeam._id}, {members: updatedMembers}).exec();
                console.log(test);
            } else {
                throw new Error('Team not found');
            }
        }

        await newUser.save();
        
    } catch(error) {
        // TODO: Check if is necessary to delete team
        // TODO: Delete user
        console.log('POST /signup Error: ', error);
        res.redirect('/login');
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})

module.exports = router;