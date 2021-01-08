const mongoose = require('mongoose');

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
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
});

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email, password });
    return user;
}

const User = mongoose.model('User', userSchema);

module.exports = User;