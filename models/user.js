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

userSchema.pre('save', async function (next) {
    console.log(`password: ${this.password}`);
    console.log(this);
    const user = this;
    const hash = await bcrypt.hash(this.password, 10);

    this.password = hash;

    next();
});

userSchema.statics.isValidPassword = async (password, hashedPassword) => {
    const user = this;
    const compare = await bcrypt.compare(password, hashedPassword);
    return compare;
}

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;