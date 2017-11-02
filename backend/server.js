const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local');
const MongoStore = require('connect-mongo')(session);

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
const Document = require('./Document');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

app.use(session({
  secret: 'secret sauce',
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));

app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/login', (req, res) => {
  // res.sendFile(path.join(__dirname, "..", 'build', "login.html"));
  res.send('get login');
});

app.post('/login', passport.authenticate('local'), (req, res) => {
  console.log('reqUser', req.user);
  res.send(req.user);
});

app.get('/logout', function(req, res) {
  req.logout();
  res.send({success: true});
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

app.post('/getdocument', (req, res)=>{
  console.log('inside get document');
  Document.findById(req.body.docid, (err, docs) => {
    if (err) {
      console.error(err);
    } else {
      console.log('docs', docs);
      res.send(docs);
    }
  });
});

app.post('/getAllDocs', (req, res)=>{
  console.log('inside get all docs user', req.user);
  Document.find({user: req.body.id}, (err, docs) => {
    if (err) {
      console.error(err);
    } else {
      console.log('docs', docs);
      res.send(docs);
    }
  });
});

app.post('/newdoc', (req, res) => {
  const newDoc = new Document(req.body);
  newDoc.save((err, result) => {
    if (err) {
      res.send('there was some kind of error');
    } else {
      res.send(result);
    }
  });
});

app.post('/updatedoc', (req, res) => {
  Document.findById(req.body.id, (err, doc) => {
    if (err) {
      console.error(err);
    } else {
      doc.body = req.body.body;
      doc.save((err, result)=>{
        if (err){
          res.send(err);
        } else {
          res.send('body updated');
        }
      });
    }
  });
});

app.post('/deletedoc', (req, res) => {
  Document.findByIdAndRemove(req.body.docid, (err, doc) => {
    if (err) {
      console.error(err);
    } else {
      res.send('Successfully deleted!');
    }
  });
});


app.post('/addSharedDoc', (req, res) => {
  Document.findById(req.body.id, (err, doc) => {
    if (err) {
      console.error(err);
    } else {
      res.send(doc);
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

app.listen(3000, function () {
  console.log('Backend server for Electron App running on port 3000!');
});
