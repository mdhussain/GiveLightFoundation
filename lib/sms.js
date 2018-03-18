const env = require('../config/secret.json');

var isConfigured = function () {
    return env.twilio_api_key && env.twilio_auth_token && env.fromPhone
}

var sendText = function (textOptions) {
    var client = require('twilio')(env.twilio_api_key, env.twilio_auth_token);
    return new Promise((resolve, reject) => {
        client.messages.create({
            from: env.fromPhone,
            to: textOptions.to,
            body: textOptions.text
        }, function (error, message) {
            if (error) {
                console.log(error);
                return reject(error);
            }
            return resolve(message);
        });
    })
}

exports.sendText = sendText;
exports.isConfigured = isConfigured;