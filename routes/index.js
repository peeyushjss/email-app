const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const session = require('express-session');

router.get('/', function(req, res) {
    console.log('Peeyush');
    res.render('settings.html', {
        title: "Settings"
    });
    // res.redirect('/settings');
});

router.get('/settings', function(req, res, next) {
    res.render('settings.html', {
        title: "Settings"
    });
});

router.post('/settings', function(req, res, next) {
    if (req.body.email && req.body.password) {
        req.session.email = req.body.email;
        req.session.password = req.body.password;
        res.redirect('/email');
    } else {
        res.render('error.html', {
            title: "Error"
        });
    }
})

router.get('/email', function(req, res, next) {
    res.render('email.html', {
        title: "Email"
    });
});

router.post('/email', function(req, res, next) {
    let bodyData = req.body;
    let sessionData = req.session;
    if (sessionData.email && sessionData.password && bodyData.to && bodyData.body && bodyData.subject) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: sessionData.email,
                pass: sessionData.password
            }
        });

        let mailOptions = {
            from: sessionData.email,
            to: bodyData.to,
            subject: bodyData.subject,
            text: 'Your Password is : Peeyush.',
            html: '<h3>' + bodyData.body + '</h3>'
        };
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                res.render('error.html', {
                    title: "Error"
                });
            } else {
                sessionData.destroy();
                res.render('success.html', {
                    title: "Success"
                });
            }
        });
    } else {
        res.render('error.html', {
            title: "Error"
        });
    }
});

module.exports = router;