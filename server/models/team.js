const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    teamCode: {
        type: String,
        unique: true
    },
    teamName: {
        type: String,
        required: true,
        unique: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    history: [{
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        date: {
            type: Date,
            required: true
        }        
    }],
    lastMade: {
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        date: {
            type: Date,
            required: true
        }        
    }
});

teamSchema.statics.generateTeamCode = async () => {
    return new mongoose.Types.ObjectId();
}

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;