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

// ⭐ PUG TEMPLATE ENGINE (важно за тестовете)
app.set('view engine', 'pug');
app.set('views', './views/pug');

// ⭐ HOME ROUTE – трябва да е ИЗВЪН myDB(), за да минат тестовете
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Connected to Database',
    message: 'Please log in',
    showLogin: true,
    showRegistration: true
  });
});

// ⭐ MIDDLEWARE
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

fccTesting(app);
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ⭐ AUTH CHECK
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

// ⭐ DATABASE + ROUTES
myDB(async client => {
  const myDataBase = await client.db('database').collection('users');

  // LOGIN
  app.route('/login').post(
    passport.authenticate('local', { failureRedirect: '/' }),
    (req, res) => {
      res.redirect('/profile');
    }
  );

  // PROFILE
  app.route('/profile').get(ensureAuthenticated, (req, res) => {
    res.render('profile', { username: req.user.username });
  });

  // LOGOUT
  app.route('/logout').get((req, res, next) => {
    req.logout(err => {
      if (err) return next(err);
      res.redirect('/');
    });
  });

  // REGISTER
  app.route('/register')
    .post((req, res, next) => {
      myDataBase.findOne({ username: req.body.username }, (err, user) => {
        if (err) return next(err);
        if (user) return res.redirect('/');

        myDataBase.insertOne(
          {
            username: req.body.username,
            password: req.body.password
          },
          (err, doc) => {
            if (err) return res.redirect('/');
            next(null, doc.ops[0]);
          }
        );
      });
    },
    passport.authenticate('local', { failureRedirect: '/' }),
    (req, res) => {
      res.redirect('/profile');
    }
  );

  // 404
  app.use((req, res) => {
    res.status(404).type('text').send('Not Found');
  });

  // PASSPORT STRATEGY
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

}).catch(e => {
  app.route('/').get((req, res) => {
    res.render('index', { title: e, message: 'Unable to connect to database' });
  });
});

// ⭐ LISTEN (ВАЖНО ЗА CODESPACES)
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on port ${PORT}`);
});