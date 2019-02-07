
const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', {session: false});

const router = express.Router();
router.use(jwtAuth);


// Load models
const { Session } = require('./models');
const Session = mongoose.model('sessions');

// Session index page--show all sessions
router.get('/', (req, res) => {
  Session.find({ user: req.user.id })
    .sort({ date: 'desc' })
    .then(sessions => {
      res.render('sessions/index', {
        sessions
      });
    });
});

//Could have a GET request for type of exercise, or should i make GETs for all the data types?

// Add a session form
router.get('/add',(req, res) => {
  res.render('sessions/add');
});

// check form--do i need this, or do the model checks suffice
router.post('/', (req, res) => {
  let errors = [];
  if (!req.body.type) {
    errors.push({ text: 'Please add a type' });
  }
  if (!req.body.calories) {
    errors.push({ text: 'Please enter a calorie amount' });
  }
  if (!req.body.max-hr) { //does it matter that i have a hypen here
    errors.push({ text: 'Please enter a max hr' });
  }
  if (!req.body.duration) {
    errors.push({ text: 'Please enter a session length' });
  }
if (!req.body.content) {
    errors.push({ text: 'Please enter some workout notes' });
  }
  //no comment requirement

  //should i have a date option, or does model take care of this? should i offer backdating?


  if (errors.length > 0) {
    res.render('sessions/add', {
      errors,
      type: req.body.type,
      calories: req.body.calories,
      max-hr: req.body.max-hr,
      duration: req.body.duration,
      content: req.body.content
    });
  } else {
    const newSession = {
      type: req.body.type,
      user: req.user.id,
      calories: req.body.calories,
      max-hr: req.body.max-hr,
      duration: req.body.duration,
      content: req.body.content,
      //created: not what sure to do about this. i have it defined in the model, do i redefine here?

    };
    new Session(newSession).save().then(session => {
      res.redirect('/sessions');
    });
  }
});


// Edit a session form
router.get('/edit/:id', (req, res) => {
  Session.findOne({
    _id: req.params.id
  }).then(session => {
    if (session.user != req.user.id) {
      req.flash('error_msg', 'Not Authorized.');
      res.redirect('/sessions');
    } else {
      res.render('sessions/edit', {
        session
      });
    }
  });
});

// Edit form check --ajax?
router.put('/:id', (req, res) => {
  Session.findOne({
    _id: req.params.id
  }).then(session => {
    // edited values
    session.type = req.body.type;
    session.idea = req.body.idea;
    session.calories = req.body.calories;
    session.max-hr = req.body.max-hr;
    session.duration = req.body.duration;
    session.content = req.body.content;


    session.save().then(session => {
      res.redirect('/sessions');
    });
  });
});

// Delete session--should this be more complex or is this ok
router.delete('/:id', (req, res) => {
  Session.deleteOne({ _id: req.params.id }).then(() => {
    res.redirect('/sessions');
  });
});

module.exports = {router};