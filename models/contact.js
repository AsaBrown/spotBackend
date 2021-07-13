let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const contactSchema = new Schema({
    phone: String,
    name: String,
    expectSelection: Boolean,
    expectName: Boolean,
    lastSongQuery: String
});

const ContactModel = mongoose.model('ContactModel', contactSchema);

module.exports = ContactModel;