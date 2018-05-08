const mailer = require('./mailer')
const mime_type = require('./mime_type')


const jade = require('jade')

var sendEmail = function (req, res) {
	console.log("Email request ", req.body);
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
		console.log(error);
		//TODO check how to handle error, this is not sending out the cause in JSON.
		return res.status(500).json({"error": 'Internal Server Error'})
	})
};

function notifyUserWithMessage(organizer, user, message, res) {
	const htmlLocals = {
		"user": user,
		"message": message,
		"rsvp_message": "Please response to, " + organizer.name + ": " + organizer.email
	}
	var html = getEmailHTML('./email_templates/message_user.jade', htmlLocals)
	var mailOptions = {
		to: user.email,
		subject: 'GiveLight Foundation Organizer message for you',
		text: html
	}
	mailerSendEmailWithOptions(mailOptions, res)
}

function notifyUser(user, res) {
	const htmlLocals = {
		"user": user,
	}
	var html = getEmailHTML('./email_templates/new_user_email.jade', htmlLocals)
	
	var mailOptions = {
		to: user.email,	
		subject: 'GiveLight Foundation Welcomes you',
		text: html
	};

	mailerSendEmailWithOptions(mailOptions, res)
};

function notifyAdmin(user, res) {
	const htmlLocals = {
		"user": user,
	}
	var html = getEmailHTML('./email_templates/admin_new_user.jade', htmlLocals)
	var mailOptions = {
		to: "j@jmstudios.net",
		subject: 'GiveLight Notification',
		text: html
	};

	mailerSendEmailWithOptions(mailOptions, res)
};

function getEmailHTML(jadeFilePath, locals) {
	const thejade = jade.compileFile(jadeFilePath, {});
	return thejade(locals);
}

function mailerSendEmailWithOptions(mailOptions, res) {
	mailer.sendEmail(mailOptions).then((results) => {
		console.log("mailer send happend: ", results)
		res.status(201).json({"msg": "success"})
		//return res.status(200).json({ "sent": "true" })
	}).catch((error) => {
		console.log("mailer send error: ", error)
		//return res.status(500).json(error)
		res.status(401).json({"err": error})
	})
}

exports.sendEmail = sendEmail;
exports.notifyAdmin = notifyAdmin;
exports.notifyUser = notifyUser;
exports.notifyUserWithMessage = notifyUserWithMessage;
