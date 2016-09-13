var cfg = require('../config');
var twilio = require('twilio');
var client = new twilio.RestClient(cfg.twilioAccountSid, cfg.twilioAuthToken);

docs.forEach(function (appointment) {
    // Create options to send the message
    var options = {
        to: "+" + appointment.phoneNumber,
        from: cfg.twilioPhoneNumber,
        body: "Hi " + appointment.name + ". Just a reminder that you have an appointment coming up  " + moment(appointment.time).calendar() + "."
    };

    // Send the message!
    client.sendMessage(options, function (err, response) {
        if (err) {
            // Just log it for now
            console.error(err);
        } else {
            // Log the last few digits of a phone number
            var masked = appointment.phoneNumber.substr(0,
                appointment.phoneNumber.length - 5);
            masked += '*****';
            console.log('Message sent to ' + masked);
        }
    });
});

// Don't wait on success/failure, just indicate all messages have been
// queued for delivery
if (callback) {
    callback.call(this);
}

function alert(phoneNumber, message) {

    var options = {
        to: format(phoneNumber),
        from: cfg.twilioPhoneNumber,
        body: message
    };

    client.sendMessage(options, function (err, response) {
        if (err) {
            // Just log it for now
            console.error(err);
        } else {
            // Log the last few digits of a phone number
            var masked = appointment.phoneNumber.substr(0,
                appointment.phoneNumber.length - 5);
            masked += '*****';
            console.log('Message sent to ' + masked);
        }
    });

    //////

    function format(num) {
        num = num.substr(0,2) == '+1'
            ? num.substr(2,num.length)
            : num;
        return '+1' + num.replace(/[^0-9]/g, '')
    }
}

module.exports = alert;

//FAVdPCiAdb3BcbYNfDc06JR