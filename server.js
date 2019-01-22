const express = require('express');
const app = express();
app.use(express.static('public'));

app.get('/user-stats', (req, res) => {
  res.sendFile(__dirname + '/public/user-stats.html');
});

app.get('/new-post', (req, res) => {
   res.sendFile(__dirname + '/public/new-post.html');
});

app.listen(process.env.PORT || 8080);



//old code above, new code below


require('dotenv').config()

const express = require('express');
const morgan = require('morgan');
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require("./config");
const { blogPost, Author } = require("./models");

const app = express();
app.use(morgan('common'));
app.use(express.json());

//CRUD endpoints = root, user-stats, new-post

// GET requests to / root

app.get("/", (req, res) => {
  workoutPost.find() 
   .populate('user')  
    .then(posts => {
      console.log(posts)
      res.json({
        posts: posts.map(post => post.serialize())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

// can also request by ID, this shows you an individual post by its ID?
app.get("/:id", (req, res) => {
  workoutPost
    // this is a convenience method Mongoose provides for searching
    // by the object _id property
    .findById(req.params.id)
    .populate('user') 

    .then(post => { 
    post.comments.push(
          { "content": "Here is a first comment." },
          { "content": "Here is a second comment." },
          { "content": "Here is a third comment." }
      );
    //post.save()
    return post;
})
    .then(post => {

    res.json(post.serialize())

})
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});


app.post('/', (req, res) => {
 
  const requiredFields = ['type', 'calories', 'max hr', 'length', 'user', 'content'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  
  }


  workoutPost.create({
    type: req.body.type,
     calories: req.body.calories,
     max hr: req.body.max hr, //when ive got two words here how is this correctly written
     length: req.body.length,
     user: req.body.user,
     content: req.body.content,

     })
.then(post => res.status(201).json(post.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: err.message });


    });
});


app.put("/:id", (req, res) => {
  // ensure that the id in the request path and the one in request body match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message =
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`;
    console.error(message);
    return res.status(400).json({ message: message });
  }

  // we only support a subset of fields being updateable.
//theoretically, the other data would be grabbed from a wearable
  const toUpdate = {};
  const updateableFields = ["type","content"];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  workoutPost

    .findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(post => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});

app.delete("/:id", (req, res) => {
  workoutPost.findByIdAndRemove(req.params.id)
    .then(post => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});




//user-stats endpoints

app.get('/user-stats', (req, res) => {
  User
    .find()
    .then(users => {
      res.json(users.map(user => user.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went wrong' });
    });
});


app.post('/user-stats', (req, res) => {
  const requiredFields = ['firstName', 'lastName', 'userName'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  
  }


  User
    .findOne({ userName: req.body.userName })
    .then(user => {
      if (user) {
        const message = `Username already taken`;
        console.error(message);
        return res.status(400).send(message);
      }

      else {
        User
          .create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName
          })
          //.then(author => res.status(201).json({
              //_id: author.id,
              //name: `${author.firstName} ${author.lastName}`,
              //userName: author.userName
           

          .then(user => res.status(201).json(user.serialize()))
      }
    })
    .catch(err => {
      console.error(err);
      res.status(400).json({ message: err.message });
    })

        

    
});

app.put("/user-stats/:id", (req, res) => {
  // ensure that the id in the request path and the one in request body match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message =
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`;
    console.error(message);
    return res.status(400).json({ message: message });
  }

  // we only support a subset of fields being updateable.
  // if the user sent over any of the updatableFields, we udpate those values
  // in document
  const toUpdate = {};
  const updateableFields = ["firstName", "lastName", "userName"];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });


User
    .findOne({ userName: updated.userName, _id: { $ne: req.params.id } })
    .then(user => {
      if(user) {
        const message = `Username already taken`;
        console.error(message);
        return res.status(400).send(message);
      }
      else {
        User
          .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
          .then(updatedUser => {
            res.status(200).json({
              id: updatedUser.id,
              name: `${updatedUser.firstName} ${updatedUser.lastName}`,
              userName: updatedUser.userName
            });
          })
          .catch(err => res.status(500).json({ message: err }));
      }
    });
});






//again issue with checking if username already exists

app.delete("/user-stats/:id", (req, res) => {
  User
    //.findByIdAndRemove(req.params.id)
    .findById(req.params.id).then(user => user.remove())
    .then(user => res.status(204).json({message: "Successfully deleted posts and user"}))
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});


// catch-all endpoint if client makes request to non-existent endpoint
//app.use("*", function(req, res) {
  //res.status(404).json({ message: "Not Found" });
//});


// both runServer and closeServer need to access the same
// server object, so we declare `server` here, and then when
// runServer runs, it assigns a value.
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

