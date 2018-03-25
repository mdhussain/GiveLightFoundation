const mailer = require('./mailer')
const mime_type = require('./mime_type')

var sendEmail = function (req, res) {
	console.log("Email request " + req.body);
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

function notifyUser(user) {
	var mailOptions = {
		to: user.email,	// list of ADMIN EMAILSreceivers
		subject: 'GiveLight Foundation Welcomes you',
		text: 'Hi,\n' +
			'\t Welcome, ' + user.name + '\n' +
			'\nRegards\n' +
			'GiveLight'
	};

	mailerSendEmailWithOptions(mailOptions)
};

function notifyAdmin(user) {
	var mailOptions = {
		to: "j@jmstudios.net",	// list of ADMIN EMAILSreceivers
		subject: 'GiveLight Notification',
		text: 'Hi,\n' +
			'\t A new user has SignedUp. Here is the new User Info,\n\n' +
			'\t Name : ' + user.name + '\n' +
			'\t Email : ' + user.email + '\n' +
			'\t Phone : ' + user.phone + '\n' +
			'\t Country : ' + user.country + '\n' +
			'\t Region : ' + user.region + '\n' +
			'\t Interest : ' + user.interests + '\n' +
			'\t Skills : ' + user.skills + '\n\n' +
			'\nRegards\n' +
			'GiveLight'
	};

	mailerSendEmailWithOptions(mailOptions)
};

function mailerSendEmailWithOptions(mailOptions) {
	mailer.sendEmail(mailOptions).then((results) => {
		console.log("mailer send happend: ", results)
		//return res.status(200).json({ "sent": "true" })
	}).catch((error) => {
		console.log("mailer send error: ", error)
		//return res.status(500).json(error)
	})
}

exports.sendEmail = sendEmail;
exports.notifyAdmin = notifyAdmin;
exports.notifyUser = notifyUser;
