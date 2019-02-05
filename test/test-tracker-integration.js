onst chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

// this makes the expect syntax available throughout
// this module
const expect = chai.expect;

const {BlogPost} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

//this ends the setup section

function seedPostData() {
  console.info('seeding post data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generatePostData());
  }
  // this will return a promise
  return workoutPost.insertMany(seedData);
}

function generateType() {
  const types = ['Run', 'Rower', 'Weights'];
  return types [Math.floor(Math.random() * types.length)];
}

function  generateCalories() {
return faker.random.number()
}

function  generateMaxHr() {
return faker.random.number()
}

function  generatelength() {
return faker.random.number()
}

function generateContent() {
  const contents = ['Content1', 'Content2', 'Content3'];
  return contents [Math.floor(Math.random() * contents.length)];
}

function generateCreated() {
return faker.date.past()
}

// generate an object represnting a restaurant.
// can be used to generate seed data for db
// or request.body data
function generatePostData() {
  return {
    user: {firstName: faker.name.firstName(),
    	lastName: faker.name.lastName()
    },
    type: generateType(),
    calories: generateCalories(),
    max-hr: generateMaxHr(),
    length: generateLength(),
    content: generateContent(),
    created: generateCreated()
  };
}


// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure data from one test does not stick
// around for next one
function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('workoutPosts API resource', function() {

  // we need each of these hook functions to return a promise
  // otherwise we'd need to call a `done` callback. `runServer`,
  // `seedRestaurantData` and `tearDownDb` each return a promise,
  // so we return the value returned by these function calls.
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedPostData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

// note the use of nested `describe` blocks.
  // this allows us to make clearer, more discrete tests that focus
  // on proving something small




  describe('GET endpoint for root', function() {

    it('should return all existing posts', function() {
      // strategy:
      //    1. get back all posts returned by by GET request to `/`
      //    2. prove res has right status, data type
      //    3. prove the number of posts we got back is equal to number
      //       in db.
      //
      // need to have access to mutate and access `res` across
      // `.then()` calls below, so declare it here so can modify in place
      let res;
      return chai.request(app)
        .get('/')
        .then(function(_res) {
          // so subsequent .then blocks can access response object
          res = _res;
          expect(res).to.have.status(200);
          // otherwise our db seeding didn't work
          expect(res.body).to.have.lengthOf.at.least(1);
          return workoutPosts.count();
        })
        .then(function(count) {
          expect(res.body).to.have.lengthOf(count);
        });
    });


    it('should return posts with right fields', function() {
      // Strategy: Get back all posts, and ensure they have expected keys

      let resworkoutPost;
      return chai.request(app)
        .get('/')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.lengthOf.at.least(1);

          res.body.forEach(function(post) {
            expect(post).to.be.a('object');
            expect(post).to.include.keys(
              'user', 'type', 'calories', 'length', 'max-hr', 'content', 'created');
          });
          resworkoutPost = res.body[0];
          return workoutPost.findById(resworkoutPost.id)
          .then (post => post.serialize())
        })
        .then(function(post) {
        
          expect(resworkoutPost.user).to.equal(post.user);
          expect(resworkoutPost.type).to.equal(post.type);
           expect(resworkoutPost.calories).to.equal(post.calories);
            expect(resworkoutPost.length).to.equal(post.length); //is this term going to cause problems
            expect(resworkoutPost.max-hr).to.equal(post.max-hr);
          expect(resworkoutPost.content).to.equal(post.content);
          expect(new Date(resworkoutPost.created)).to.deep.equal(post.created);
        });
    });
  });

  describe('POST endpoint', function() {
    // strategy: make a POST request with data,
    // then prove that the restaurant we get back has
    // right keys, and that `id` is there (which means
    // the data was inserted into db)
    it('should add a new post', function() {

      const newWorkoutPost = generatePostData();
      //let mostRecentGrade;

      return chai.request(app)
        .post('/')
        .send(newWorkoutPost)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys(
            'id', 'user', 'type', 'calories', 'max-hr', 'length', 'content', 'created');
          expect(res.body.user).to.equal(newWorkoutPost.user.firstName
          + " " +newWorkoutPost.user.lastName);
          // cause Mongo should have created id on insertion
          expect(res.body.id).to.not.be.null;
          expect(res.body.type).to.equal(newWorkoutPost.type);
          expect(res.body.content).to.equal(newWorkoutPost.content);
          expect(res.body.calories).to.equal(newWorkoutPost.calories);
          expect(res.body.max-hr).to.equal(newWorkoutPost.max-hr);
          expect(res.body.length).to.equal(newWorkoutPost.length);


          //expect(res.body.created).to.equal(newBlogPost.created);
          return workoutPost.findById(res.body.id);
        })
        .then(function(post) {
          //expect(post.author).to.equal(newBlogPost.author);
          expect(post.user.firstName).to.equal(newWorkoutPost.user.firstName)
          expect(post.user.lastName).to.equal(newWorkoutPost.user.lastName)

          expect(post.type).to.equal(newWorkoutPost.type);
          expect(post.content).to.equal(newWorkoutPost.content);
          expect(post.calories).to.equal(newWorkoutPost.calories);
          expect(post.max-hr).to.equal(newWorkoutPost.max-hr);
          expect(post.length).to.equal(newWorkoutPost.length);
          //expect(post.created).to.equal(newBlogPost.created);
          //expect(post.grade).to.equal(mostRecentGrade);
          //expect(post.address.building).to.equal(newRestaurant.address.building);
          
        });
    });
  });

  describe('PUT endpoint', function() {

    // strategy:
    //  1. Get an existing restaurant from db
    //  2. Make a PUT request to update that restaurant
    //  3. Prove restaurant returned by request contains data we sent
    //  4. Prove restaurant in db is correctly updated
    it('should update fields you send over', function() {
      const updateData = {
        user: { firstName: 'fofofofofofofof',
        lastName: 'fofofofofofofof',
        },
        type: 'Rower'
      };

      return workoutPost
        .findOne()
        .then(function(post) {
          updateData.id = post.id;

          // make request then inspect it to make sure it reflects
          // data we sent
          return chai.request(app)
            .put(`/${post.id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(204);

          return workoutPost.findById(updateData.id);
        })
        .then(function(post) {
        	console.log(post.user)
        	console.log(updateData.user)
          expect(post.user.firstName).to.equal(updateData.user.firstName);
          expect(post.type).to.equal(updateData.type);
        });
    });
  });

  describe('DELETE endpoint', function() {
    // strategy:
    //  1. get a restaurant
    //  2. make a DELETE request for that restaurant's id
    //  3. assert that response has right status code
    //  4. prove that restaurant with the id doesn't exist in db anymore
    it('should delete a post by id', function() {

      let post;

      return workoutPost
        .findOne()
        .then(function(_post) { //why underscore here
          post = _post;
          return chai.request(app).delete(`/${post.id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
          return workoutPost.findById(post.id);
        })
        .then(function(_post) {
          expect(_post).to.be.null;
        });
    });
  });
});
