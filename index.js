#!/usr/bin/env node

const json2xls = require('json2xls')
const fs = require('fs')
//const nodeExcel = require('exceljs')
const _ = require('lodash')
const path = require('path')
const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const session = require('express-session')
const errorHandler = require('errorhandler')
const cookieParser = require('cookie-parser')

const app = express()
const db = require('./lib/db')
const auth = require('./lib/auth')


const email = require('./lib/email')
const profile = require('./lib/profile')
const sms = require('./lib/sms')


const port = parseInt(process.env.PORT, 10) || 3000
const publicDir = __dirname + '/app'

app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }))
auth.init(app)

app.get(['/', '/signup', '/login', '/profile/:id', '/search'], (req, res) => {
    res.sendFile(path.join(publicDir, '/index.html'))
})

app.post('/api/login', (req, res, next) => {
    // See: https://github.com/jaredhanson/passport-local
    passport.authenticate('local', (err, user, info) => {
        if (err || !user) {
            console.log('error with login:', err, user)
            return res.status(422).json(err)
        }
        req.login(user, () => {
            console.log('login user')
            return res.json(user)
        })
    })(req, res, next)

})

app.get('/api/auth/facebook', passport.authenticate('facebook'));

app.get('/api/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
    res.redirect(`/profile/${req.user._id}`)
});

app.post('/api/users/search', (req, res) => {
    if (auth.isAdmin(req)) {
        return profile.searchall(req, res);
    } else {
        return res.status(403).json({ error: 'You do not have permission to access this resource...' });
    }
});

app.post('/api/admin/groupNotification', (req, res) => {
    if (auth.isAdmin(req)) {
        var reqBody = _.pick(req.body, [
            'volunteers', 'type', 'message'
        ])
        console.log(reqBody)
        if (reqBody.type === 'email') {
            reqBody.volunteers.map( volunteer => {
                const message = reqBody.message
                email.notifyUserWithMessage(req.user, volunteer, message, res)
            })
        }
        else if (reqBody.type === 'sms'){
            reqBody.volunteers.map( volunteer => {
                const message = reqBody.message + "          Please respond to " + req.user.name + ": " + req.user.phone
                const messageOptions = {
                    to: '+' + volunteer.phone,
                    message: reqBody.message 
                }
                console.log("send text: ", res)
                sms.sendText(messageOptions, res)
            })

        }
    } else {
        return res.json({ error: 'You do not have permission to access this resource...' });
    }
});

app.get('/api/users', (req, res) => {
    if (auth.isAdmin(req)) {
        db.getAll('user').then(users => {
            return res.json({ users })
        })
    } else {
        return res.status(403).json({ error: 'You do not have permission to access this resource.' })
    }
})

app.get('/api/user/:id', (req, res) => {
    if (req.user) {
        var user = req.user
        return res.json({ user });
    }
    if (req.isAuthenticated() && req.params.id === req.user._id.toString()) {
        db.getById('user', req.params.id).then(user => {
            req.user = user
            return res.json({ user })
        })
    } else {
        return res.status(401).json({ error: 'Not authenticated' })
    }
})

app.get('/api/admin/users', (req, res) => {
    if (auth.isAdmin(req)) {
        db.getAll('user').then((results) => {
            return res.json(results)
        }).catch((error) => {
            console.log(error)
            return res.status(422).json(error)
        })
    }
    else {
        return res.status(403).json({ error: 'You do not have permission to access this resource.....' })
    }
})

app.post('/api/user', (req, res) => {
    // It is good practice to specifically pick the fields we want to insert here *in the backend*,
    // even if we have already done so on the front end. This is to prevent malicious users
    // from adding unexpected fields by modifying the front end JS in the browser.
    var newUser = _.pick(req.body, [
        'name', 'email', 'country', 'region', 'phone', 'interests', 'passphrase', 'skills'
    ])
    newUser.isAdmin = false
    newUser.approvedBy = ''
    db.insertOne('user', newUser).then(result => {
        email.notifyAdmin(req.user, newUser, res)
        email.notifyUser(newUser, res)
    }).catch(error => {
        console.log(error)
        return res.status(422).json(error)
    })
})

app.post('/api/admin/user/makeAdmin', (req, res) => {
    if (auth.isAdmin(req)) {
        db.getByEmail('user', _.pick(req.body, ['email'])).then(volunteer => {
            volunteer.isAdmin = true
            volunteer.approvedBy = req.user._id
            db.updateOneById('user', volunteer).then(result => {
                return res.status(200).json(result)
            }).catch(error => {
                console.log(error)
                return res.status(200).json(error)
            })
        }).catch(error => {
            console.log('error in getByEmail', error)
        })
    }
    else {
        return res.status(403).json({ error: 'You do not have permission to access this resource.....' })
    }
})

app.put('/api/user', (req, res) => {
    if (req.isAuthenticated() && req.body._id === req.user._id.toString()) {
        db.updateOneById('user', req.body).then(result => {
            var userRecord = req.body;
            userRecord.recordType = 'User Profile Update'
            email.notifyUser(userRecord, res);
        }).catch(error => {
            console.log(error)
            return res.json(error)
        })
    } else {
        return res.status(403).json({ error: 'Not authenticated' })
    }
})


app.post('/api/users/email', (req, res) => {
    if (auth.isAdmin(req)) {
        const toPpl = req.body.to
        var users = []
        console.log(req.body)
        toPpl.map(email => {
            db.getByEmail('user', email).then(user => {
                
                users.push(user)
            })
        })
        const subject = req.body.subject
        const message = req.body.contents
        console.log(users)

        users.map(user => {
            email.notifyUserWithMessage(req.user, user, message, res)
        })


        
    } else {
        return res.status(403).json({ error: 'You do not have permission to access this resource...' });
    }
});

app.post('/api/users/sms', (req, res) => {
    if (auth.isAdmin(req)) {
        const toNumbers = req.body.to_phone
        toNumbers.map(phone => {
            const textInfo = {
                to: phone,
                message: req.body.text
            }
            sms.sendText(textInfo, res)
        })
    } else {
        return res.status(403).json({ error: 'You do not have permission to access this resource...' });
    }
});

app.use(express.static(publicDir))
app.use(errorHandler({
    dumpExceptions: true,
    showStack: true
}))

console.log('Simple static server showing %s listening at port %s', publicDir, port)
app.listen(port)
