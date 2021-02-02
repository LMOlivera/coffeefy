const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const Team = require('../models/team');
const {authenticated, notAuthenticated} = require('../middleware/auth');

router.get('/home', authenticated, async (req, res) => {
    let userTeam = await Team.findOne({teamCode: req.session.team.teamCode}).exec();
    let members = await User.find().where('_id').in(userTeam.members).sort({makerSince: 1}).exec();

    let filteredMembers = [];
    let memberWhoLastPreparedCoffee;
    let pointerToLastCoffee;
    let memberWhoPreparesCoffeeToday;
    for (let i = 0; i < members.length; i++) {
        filteredMembers.push(members[i].name);

        if (members[i]._id.toString().localeCompare(userTeam.lastMade.member)) {
            memberWhoLastPreparedCoffee = members[i];
            pointerToLastCoffee = i;
        }
    }
    if (pointerToLastCoffee == members.length-1) {
        memberWhoPreparesCoffeeToday = members[0];
    } else {
        memberWhoPreparesCoffeeToday = members[pointerToLastCoffee+1];
    }

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
    
    res.render('home',
        {
            user: req.session.name,
            members: filteredMembers,
            madeToday,
            last: memberWhoLastPreparedCoffee.name,
            today: memberWhoPreparesCoffeeToday.name
        }
    );
})

router.post('/mark', authenticated, async (req, res) => {
    // Add error handling
    const userData = await User.findOne({teamCode: req.session.team.teamCode, name: req.session.name}).exec();
    
    const today = new Date();
    await Team.findOneAndUpdate({teamCode: req.session.team.teamCode}, {
        lastMade: {
            member: userData._id,
            name: req.session.name,
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

router.get('/calendar', authenticated, async(req, res) => {
    // Verify req.query.year
    const USER_TEAM = await Team.findOne({teamCode: req.session.team.teamCode}).exec();
    let members = await User.find().where('_id').in(USER_TEAM.members).exec();
    let formattedMembers = {};
    members.map((member) => {
        formattedMembers[member._id] = member.name;
    });


    let year = req.query.year;

    let monthData = {
        0: {},
        1: {},
        2: {},
        3: {},
        4: {},
        5: {},
        6: {},
        7: {},
        8: {},
        9: {},
        10: {},
        11: {}
    };

    USER_TEAM.history.map((record) => {
        if (new Date(record.date).getFullYear() == year) {
            let month = new Date(record.date).getMonth();
            let day = new Date(record.date).getDate();

            let dayData = {};
            dayData[day] = formattedMembers[(record.member)];
            Object.assign(monthData[month], dayData);
        }        
    });

    res.send(monthData);
})

module.exports = router;