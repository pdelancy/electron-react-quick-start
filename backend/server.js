const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);
const MongoStore = require('connect-mongo')(session);

//store session in the database, if dont have mongostore, everytime re-render session data would be lose
app.use(session({ secret: 'secret sauce',
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));

//Bodyparser parses fields sent in json format, axios send fields in json
app.use(bodyParser.json());

//use passport to turn the user in to an id at the beginning and turn the id into an user at the end
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ username: username }, function(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false, { message: 'Incorrect username.' });
    if (user.password !== password) return done(null, false, { message: 'Incorrect password.' });
    return done(null, user);
  });
}));

app.use(passport.initialize());
app.use(passport.session());

const User = require('./User');



app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/login', (req, res) => {
  // res.sendFile(path.join(__dirname, "..", 'build', "login.html"));
  res.send('get login');});

app.post('/login', passport.authenticate('local'), (req, res) => {
  res.redirect('/');
});

app.get('/register', (req, res) => {
  // res.sendFile(path.join(__dirname, "..", 'build', "register.html"));
  res.send('get register');
});

app.post('/register', (req, res) => {
  console.log('register body', req.body);
  const newUser = new User(req.body);
  newUser.save((err, result) => {
    if (err) {
      res.json({success: false, error: err});
    } else {
      res.json({success: true});
    }
  });
});

app.use((req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "..", 'build', 'index.dev.html'));
});

app.listen(3000, function () {
  console.log('Backend server for Electron App running on port 3000!')
})
