const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var MongoStore = require('connect-mongo')(session);

app.use(session({
  secret: 'secret sauce',
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));

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

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// app.get('/login', (req, res) => {
//   res.sendFile(path.join(__dirname, "..", 'build', "login.html"));
// });
app.get('/', (req, res) => {
  res.send('successfully connected to server');
});

app.post('/login', passport.authenticate('local'), (req, res) => {
  res.send('successfully logged in');
});

// app.get('/register', (req, res) => {
//   res.send('');
// });

app.post('/register', (req, res) => {
  const newUser = new User(req.body);
  newUser.save((err, result) => {
    if (err) {
      res.send('there was some kind of error');
    } else {
      res.send('succesfully registered');
    }
  });
});

app.use((req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.send('not logged in');
  }
});



app.get('/users', (req, res) => {
  User.find()
  .then((users)=>{
    res.send(users);
  });
});

app.listen(3000, function () {
  console.log('Backend server for Electron App running on port 3000!');
});
