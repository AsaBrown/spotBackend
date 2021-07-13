const mongoose = require('mongoose');

const initDb = () => {
    mongoose.connect(process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log('DB CONNECTED');
    });
}

module.exports = {
    initDb
}