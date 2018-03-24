'use strict';

var nodemailer = require('nodemailer');
const env = require('../config/secret.json');
const mime_type = require('./mime_type')


var transporter = nodemailer.createTransport({
	service: 'Mailgun',
	auth: {
		user: env.mailGunUser,
		pass: env.mailGunPassword
	}
});

var sendEmail = function (mailOptions) {
	return new Promise((resolve, reject) => {
		if (mailOptions.content_type == mime_type.HTML_MIME_TYPE) {
			mailOptions.text = mailOptions.html.replace(/<[^>]+>/g, '');
		}
		else {
			mailOptions.html = null;
		}
		console.log(mailOptions.text);
		console.log(mailOptions.html);
		mailOptions.from = env.newUserNotifEmail, // sender email address
			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					console.log(error);
					return reject(error);
				}
				return resolve(info.response)
			});
	})
};

module.exports = {
	sendEmail
};
