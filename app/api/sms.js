const sms = require('../../lib/sms')

var sendSms = function (req, res) {
    console.log("Sms request " + JSON.stringify(req.body));
    if (!sms.isConfigured()) {
        return res.status(500).json({ "error": "SMS is not configured" });
    }
    else {
        var arr = req.body.to_phone;
        var promises = [];
        arr.forEach(function (phone) {
            var textOptions = {
                to: phone,
                text: req.body.text
            };
            var promise = new Promise((resolve, reject) => {
                sms.sendText(textOptions).then((results) => {
                    resolve({ "phone": phone, "sent": true })
                }).catch((error) => {
                    resolve({ "phone": phone, "error": error })
                });
            });
            promises.push(promise);
        });
        Promise.all(promises).then(results => {
            var hasError = false;
            results.forEach(function (result) {
                if (result.error) {
                    hasError = true;
                    return;
                }
            });
            if (hasError) {
                return res.status(207).json(results);
            }
            else {
                return res.status(200).json({ "sent": "true" })
            }
        });
    }
};

exports.sendSms = sendSms;