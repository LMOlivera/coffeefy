const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const Team = require('../models/team');

router.get('/home', async (req, res) => {
    let userTeam = await Team.findOne({teamCode: req.session.teamCode}).exec();
    let members = await User.find().where('_id').in(userTeam.members).sort({makerSince: 1}).exec();
    let filteredMembers = members.map((member) => {
        return member.name
    });
    
    res.render('home', {user: req.session.name, members: filteredMembers});
})

module.exports = router;