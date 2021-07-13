let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let logSchema = new Schema({
    name: String,
    action: String,
    createdDate: Date,
    albumArt: String
});

const LogModel = mongoose.model('LogModel', logSchema);

module.exports = LogModel;