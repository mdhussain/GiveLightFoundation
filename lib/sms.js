const env = require('../config/secret.json')
const twilio = require('twilio')

var isConfigured = function () {
    return env.twilio_api_key && env.twilio_auth_token
}

var sendText = function (textOptions, fromPhone) {
    var client = twilio(env.twilio_api_key, env.twilio_auth_token)
    return new Promise((resolve, reject) => {
        client.messages.create({
            from: env.fromPhone,
            to: textOptions.to,
            body: textOptions.message
        }, function (error, message) {
            if (error) {
                console.log(error)
                return reject(error)
            }
            console.log('MESSAGE SENT JUST FINE?')
            return resolve(message)
        });
    })
}

exports.sendText = sendText
exports.isConfigured = isConfigured
