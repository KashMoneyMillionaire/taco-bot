
var cfg = {};

// HTTP Port to run our web application
cfg.port = process.env.PORT || 3000;

// Your Twilio account SID and auth token, both found at:
// https://www.twilio.com/user/account
// A good practice is to store these string values as system environment
// variables, and load them from there as we are doing below. Alternately,
// you could hard code these values here as strings.
cfg.twilio = {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER
}


// Account information for the Microsoft Bot Framework stuff
cfg.microsoft = {
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
}

// MongoDB connection string - MONGO_URL is for local dev,
// MONGOLAB_URI is for the MongoLab add-on for Heroku deployment
cfg.mongoUrl = process.env.MONGO_URL

// Export configuration object
module.exports = cfg;
