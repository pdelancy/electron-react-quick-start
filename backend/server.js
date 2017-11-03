const express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
const bodyParser = require('body-parser');
const path = require('path');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local');
const MongoStore = require('connect-mongo')(session);
var http = require('http').Server(app);
var io = require('socket.io')(http);

server.listen(3000);
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

async function findSharedDoc(user, sharedDoc){
  for(var doc of user.sharedDoc){
    var document = await Document.findById(doc);
    sharedDoc.push(document);
  }
  return sharedDoc;
}

app.post('/getAllDocs', (req, res)=>{
  var ownDoc = [];
  var sharedDoc=[];
  // res.send(`{ownDoc: ${ownDoc}, sharedDoc: ${sharedDoc}}`);
  Document.find({user: req.body.userid}, (err, docs) => {
    if (err) {
      console.error(err);
    } else {
      ownDoc = docs.slice();
    }
  })
  .then(()=>{return User.findById(req.body.userid);})
  .then((user)=>{
    return findSharedDoc(user, sharedDoc);
  })
  .then(()=>{
    res.send({ownDoc: ownDoc, sharedDoc: sharedDoc});
    console.log(`{ownDocs: ${ownDoc}, sharedDoc: ${sharedDoc}}`);
  })
  .catch(err=>console.log(err));
});

app.post('/newdoc', (req, res) => {
  const newDoc = new Document(req.body);
  newDoc.save((doc)=>{return doc;})
  .then(resp=>{return User.findById(resp.user);})
  .then(user=>{
    user.ownDoc.push(newDoc._id);
    user.save((resp)=>{
      res.send(newDoc);});
  })
  .catch(err=>console.log(err));
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

app.post('/updatedoc', (req, res) => {
  Document.findById(req.body.id, (err, doc) => {
    if (err) {
      console.error(err);
    } else {
      doc.body = req.body.body;
      res.send('body updated');
    }
  });
});

app.post('/addSharedDoc', (req, res) => {
  //add document to the user's shared doc field, and add user to the contributor field to the doc
  console.log('req.body', req.body);
  User.findById(req.body.userid)
  .then(user=>{
    user.sharedDoc.push(req.body.docid);
    return user.save();
  })
  .then(()=>{
    Document.findById(req.body.docid, (err, doc) => {
      if (err) {
        res.send('Document does not exist! ', err);
      } else {
        doc.contributor.push(req.body.userid);
        doc.save();
        res.send(doc);
      }
    });
  })
  .catch(err=>{console.log('err in add shared doc', err);});
});


io.on('connection', function(socket) {
  let currentName = '';
  console.log('connected to sockets');
  io.emit('message', 'here');
  socket.on('join room', (roomName)=>{
    console.log('submitted join room request for: ', roomName);

    currentName = roomName;
    socket.join(roomName);
    io.in(roomName).clients((err, clients)=>{
      console.log(clients);
    });
    io.to(roomName).emit('message', `someone successfully joined ${roomName}!`);
    // socket.on('update', (contentState)=>{
    //   io.to(roomName).emit('update', contentState);
    // });

  });
  socket.on('leave room', (roomName)=>{
    console.log(`leaving ${roomName}`);
    socket.leave(roomName);
  });

  socket.on('update', (contentState, selection) => {
    console.log('receieved update request');
    io.to(currentName).emit('update', contentState);
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
