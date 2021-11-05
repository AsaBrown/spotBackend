const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const bankSchema = new Schema({
    siteUserEmail: {
        type: String,
        required: true,
        unique: true
    },
    accessToken: {
        type: String,
        required: true
    },
    bankName: {
        type: String,
        required: true
    }
});


const BankAccountModel = mongoose.model('BankAccount', bankSchema);
module.exports = BankAccountModel;