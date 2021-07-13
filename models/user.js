const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { NetworkInstance } = require('twilio/lib/rest/supersim/v1/network');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required : true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    }
});

userSchema.pre('save', async (next) => {
    const user = this;
    const hash = await bcrypt.hash(this.password, 10);

    this.password = hash;

    next();
});

userSchema.methods.isValidPassword = async (password) => {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
}

const UserModel = mongoose.model('User', UserSchema);