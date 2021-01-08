const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid.');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true
        // TODO: Add encryption
    },
    teamCode: {
        type: String,
        required: true
    }
});

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email, password });
    return user;
}

const User = mongoose.model('User', userSchema);

module.exports = User;