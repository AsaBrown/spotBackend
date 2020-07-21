const mongoose = require('mongoose');

const initDb = () => {
    mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-mssyy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log('DB CONNECTED');
    });
}

module.exports = {
    initDb
}