const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const Team = require('../models/team');
const {authenticated, notAuthenticated} = require('../middleware/auth');

router.get('/home', authenticated, async (req, res) => {
    let userTeam = await Team.findOne({teamCode: req.session.team.teamCode}).exec();
    let members = await User.find().where('_id').in(userTeam.members).sort({makerSince: 1}).exec();

    let filteredMembers = members.map((member) => {
        return member.name
    });

    // Check if coffee was made today
    let madeToday;
    if (userTeam.lastMade.date) {
        let today = new Date();
        today.setHours(0,0,0,0);

        let dateOfLastCoffee = userTeam.lastMade.date;
        dateOfLastCoffee.setHours(0,0,0,0);

        if (today > dateOfLastCoffee || today < dateOfLastCoffee) { // We cannot use "==" or "===" with dates
            madeToday = false;
        } else {
            madeToday = true;
        }
    } else {
        madeToday = false;
    }
    
    res.render('home', {user: req.session.name, members: filteredMembers, madeToday});
})

router.post('/mark', authenticated, async (req, res) => {
    // Add error handling
    const userData = await User.findOne({teamCode: req.session.team.teamCode}).exec();
    
    const today = new Date();
    await Team.findOneAndUpdate({teamCode: req.session.team.teamCode}, {
        lastMade: {
            member: userData._id,
            date: today
        }
    }).exec();
    await Team.findOneAndUpdate({teamCode: req.session.team.teamCode}, {
        $push: {
            history: {
                member: userData._id,
                date: today
            }
        }        
    }).exec();

    res.redirect('home');
})

module.exports = router;