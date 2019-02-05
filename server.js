
app.use(express.static('public'));

app.get('/user-stats', (req, res) => {
  res.sendFile(__dirname + '/public/user-stats.html');
});

app.get('/new-post', (req, res) => {
   res.sendFile(__dirname + '/public/new-post.html');
});

app.listen(process.env.PORT || 8080);



//old code above, new code below


require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const passport = require('passport');
const app = express();

//load routes

const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const { router: sessionsRouter } = require('./sessions');
//const { router: listRouter } = require('./mylist');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');


const { PORT, DATABASE_URL } = require("./config");
const { workoutPost, User, comments } = require("./models"); //these have been separated into multi model files now, how do i write this?

//logging
app.use(morgan('common'));

app.use(express.json());

//CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();

//passport setup
passport.use(localStrategy);
passport.use(jwtStrategy);
const jwtAuth = passport.authenticate('jwt', { session: false });

//do i need to put get routes here?

// index route
//app.get('/', (req, res) => {
  //const title = 'Workout Tracker';
  //res.render('index', {
    //title
  //});
//});

// About route
//app.get('/about', (req, res) => {
 // res.render('about');
//});


//use routes

// set public folder for static files
app.use(express.static('public'));

//gets all sessions for user
app.use('api/sessions/')

//for user login 
app.use('/api/users/', usersRouter);

//for user authentication
//app.use('api/auth/', authRouter);

//can i just do users/registration and users/login?

//catchall for other rando routes 
app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

//server setup
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,
      err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve();
          })
          .on("error", err => {
            mongoose.disconnect();
            reject(err);
          });
      }
    );
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };

