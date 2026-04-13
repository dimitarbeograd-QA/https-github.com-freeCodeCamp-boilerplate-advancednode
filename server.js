'use strict';
require('dotenv').config();
const express = require('express');
const myDB = require('./connection');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const session = require('express-session');
const passport = require('passport');
const { ObjectId } = require('mongodb');
const LocalStrategy = require('passport-local');

const app = express();

// 1. Настройка на Pug (Важно за теста)
app.set('view engine', 'pug');
app.set('views', './views/pug');

// Middleware
fccTesting(app);
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

// 2. Основен маршрут (Тестът търси 'Hello' и 'Please login')
app.route('/').get((req, res) => {
res.render('index');
    
// Middleware за проверка на автентикация
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

// 3. Свързване с базата данни и останалите маршрути
myDB(async (client) => {
  const myDataBase = await client.db('database').collection('users');

  // Passport Стратегия
  passport.use(new LocalStrategy((username, password, done) => {
    myDataBase.findOne({ username: username }, (err, user) => {
      console.log(`User ${username} attempted to log in.`);
      if (err) return done(err);
      if (!user) return done(null, false);
      if (password !== user.password) return done(null, false);
      return done(null, user);
    });
  }));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    myDataBase.findOne({ _id: new ObjectId(id) }, (err, doc) => {
      done(null, doc);
    });
  });

  // Login
  app.post('/login', passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/profile');
  });

  // Profile
  app.get('/profile', ensureAuthenticated, (req, res) => {
    res.render('profile', { username: req.user.username });
  });

  // Register
  app.post('/register', (req, res, next) => {
    myDataBase.findOne({ username: req.body.username }, (err, user) => {
      if (err) return next(err);
      if (user) return res.redirect('/');

      myDataBase.insertOne({
        username: req.body.username,
        password: req.body.password
      }, (err, doc) => {
        if (err) return res.redirect('/');
        // Поправка: използвай doc.insertedId вместо doc.ops[0] за по-нови драйвъри
        next(null, { _id: doc.insertedId, ...req.body });
      });
    });
  },
  passport.authenticate('local', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');
  });

  // Logout
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  // 404
  app.use((req, res) => {
    res.status(404).type('text').send('Not Found');
  });

}).catch((e) => {
  console.error(e);
  // Ако DB не се свърже, все пак показваме нещо
  app.route('/').get((req, res) => {
    res.render('index', { title: 'Error', message: 'Unable to connect to database' });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on port ${PORT}`);
});
