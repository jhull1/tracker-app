const mongoose = require("mongoose");

// this is the schema to represent a post

//const userSchema = mongoose.Schema({
  //firstName: 'string',
  //lastName: 'string',
  //userName: {
    //type: 'string',
    //unique: true
 // }
//});
const commentSchema = mongoose.Schema({ content: 'string' });

const workoutPostSchema = mongoose.Schema({
  type: { type: String, required: true },
  calories: { type: Number, required: true },
  max-hr: { type: Number, required: true },
  length: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  created: {
    type: Date, default: Date.now,
  },
   comments: [commentSchema]
});


workoutPostSchema.pre('find', function(next) {
  this.populate('user');
  next();
});

 workoutPostSchema.pre('findById', function(next) {
  this.populate('user');
  next();
});

//userSchema.pre('remove', function(next) {
  //workoutPost
   //.remove({user:this._id})
   //.exec()
  //next();
 //});



workoutPostSchema.virtual('userFullName').get(function() {
  return `${this.user.firstName} ${this.user.lastName}`.trim();
});


//userSchema.virtual('fullName').get(function() {
  //return `${this.firstName} ${this.lastName}`.trim();
//});

workoutPostSchema.methods.serialize = function() {
  return {
    id: this._id,
    type: this.type,
    calories: this.calories,
    max-hr: this.max-hr, //can i use a dash here
    length: this.length,
    content: this.content,
    user: this.userFullName,
    comments: this.comments,
    created: this.created
  };
};


//userSchema.methods.serialize = function() { //can i use this like this or does it have to be called differently
 // return {
  //  id: this._id,
  //  name: this.fullName,
  //  userName: this.userFullName
 // };
//};


const workoutPost = mongoose.model("workoutPost", workoutPostSchema);
const comments = mongoose.model("comments", commentsSchema);
//const User = mongoose.model('User', userSchema);


module.exports = { workoutPost, comments };