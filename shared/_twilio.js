const twilio = require('twilio');
const accountSid = process.env.TWIL_SID;
const authToken = process.env.TWIL_TOKEN;
let twilioClient;

const initTwilio = () => {
    twilioClient = new twilio(accountSid, authToken);
    console.log('TWILIO CONNECTED');
}

const getTwilio = () => {
    if(twilioClient)
        return(twilioClient);
}

module.exports = {
    initTwilio,
    getTwilio
}