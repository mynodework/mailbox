var express = require('express');
var router = express.Router();
var Imap = require('imap'),
  inspect = require('util').inspect;
var MailParser = require("mailparser").simpleParser;
var _ = require('lodash')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('pages/login', { title: 'MailBox' });
});

router.post('/login', function (req, res, next) {
  req.session.user = req.body
  res.redirect('/login');
});

router.get('/login', function (req, res, next) {
  let email = req.session ? (req.session.user ? req.session.user.email : false) : false
  if (!email) {
    res.render('pages/login', { title: 'MailBox' });
  }
  var imap = new Imap({
    user: req.session.user.email,
    password: req.session.user.password,
    host: 'imap.gmail.com',
    port: 993,
    tls: true
  });
  var emails = [];
  function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
  }

  imap.once('ready', function () {
    openInbox(function (err, box) {
      if (err) throw err;
      var delay = 24 * 3600 * 1000;
      var yesterday = new Date();
      yesterday.setTime(Date.now() - delay);
      yesterday = yesterday.toISOString();
      imap.search(['All', ['SINCE', yesterday]], function (err, results) {
        let uid = "";
        var f = imap.fetch(results, { bodies: '' });
        f.on('message', function (msg, seqno) {
          msg.once("attributes", function (attrs) {
            uid = attrs.uid;
          });
          msg.on('body', function (stream, info) {
            MailParser(stream).then(mail => {
              emails.push({
                from: mail.from.value[0].name || mail.from.value[0].address,
                to: mail.to.value[0].address,
                date: mail.date,
                email_date: mail.date,
                email_timestamp: new Date(mail.date).getTime(),
                subject: mail.subject,
                uid: info.seqno
              });
            })
          });
        });
        f.once('end', function () {
          imap.end();
        });
      })
    });
  });

  imap.once('error', function (err) {
    console.log(err);
  });

  imap.once('end', function () {
    var unique = _.uniqBy(emails, 'uid');
    res.render('pages/dashboard', { email: req.session.user.email, title: 'MailBox', data: emails });
  });

  imap.connect();
});

router.get('/body', function (req, res) {
  let email = req.session ? (req.session.user ? req.session.user.email : false) : false

  if (!email) {
    res.render('pages/login', { title: 'MailBox' });
  }
  var imap = new Imap({
    user: req.session.user.email,
    password: req.session.user.password,
    host: 'imap.gmail.com',
    port: 993,
    tls: true
  });
  var emails = [];
  function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
  }

  imap.once('ready', function () {
    openInbox(function (err, box) {
      if (err) throw err;
      let results = req.query.uid
      let uid = "";
     var f = imap.seq.fetch(results, {
        bodies: '',
        struct: true
      });
      f.on('message', function (msg, seqno) {
        msg.once("attributes", function (attrs) {
          uid = attrs.uid;
        });
        msg.on('body', function (stream, info) {
          MailParser(stream).then(mail => {
            emails.push({
              from: mail.from.value[0].name || mail.from.value[0].address,
              to: mail.to.value[0].address,
              date: mail.date,
              email_date: mail.date,
              email_timestamp: new Date(mail.date).getTime(),
              subject: mail.subject,
              uid: uid,
              body: mail.html
            });
          })
        });
      });
      f.once('end', function () {
        imap.end();
      });
    });
  });

  imap.once('error', function (err) {
    console.log(err);
  });

  imap.once('end', function () {
    res.send(emails[0].body)
    // res.render('pages/dashboard', { email: "test@gmail.com", title: 'MailBox', data: emails });
  });

  imap.connect();
})
module.exports = router;
