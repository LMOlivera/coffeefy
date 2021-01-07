const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    teamName: {
        type: String
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    history: [{
        type: String
    }]
});

const Team = mongoose.model('Team', userSchema);

module.exports = Team;