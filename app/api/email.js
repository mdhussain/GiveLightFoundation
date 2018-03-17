const mailer = require('../../lib/mailer')
const mime_type = require('../../lib/mime_type')

var sendEmail = function (req, res) {
	console.log("Email request " + JSON.stringify(req.body));
	var mailOptions = {
		to: req.body.to_email,
		cc: req.body.cc_email,
		bcc: req.body.bcc_email,
		subject: req.body.subject,
		content_type: mime_type.HTML_MIME_TYPE,
		html: req.body.contents
	};

	mailer.sendEmail(mailOptions).then((results) => {
		return res.status(200).json({ "sent": "true" })
	}).catch((error) => {
		return res.status(500).json(error)
	})
};


function notifyAdmin(user) {
	var mailOptions = {
		to: env.newUserNotifEmail,	// list of receivers
		subject: 'GiveLight Notification - ' + user.recordType,
		text: 'Hi,\n' +
			'\t A new user has SignedUp. Here is the new User Info,\n' +
			'\t Name : ' + user.name + '\n' +
			'\t Email : ' + user.email + '\n' +
			'\t Phone : ' + user.phone + '\n' +
			'\t Country : ' + user.country + '\n' +
			'\t Region : ' + user.region + '\n' +
			'\t Interest : ' + user.interests + '\n' +
			'\t Skills : ' + user.skills + '\n' +
			'\nRegards\n' +
			'GiveLight'
	};
	sendEmail(mailOptions);
};

exports.sendEmail = sendEmail;
exports.notifyAdmin = notifyAdmin;