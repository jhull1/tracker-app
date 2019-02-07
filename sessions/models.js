const mongoose = require("mongoose");
mongoose.Promise = global.Promise;


const commentSchema = mongoose.Schema({ content: 'string' }); //needs to be in own model now probably

const SessionSchema = mongoose.Schema({
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


SessionSchema.pre('find', function(next) {
  this.populate('user');
  next();
});

 SessionSchema.pre('findById', function(next) {
  this.populate('user');
  next();
});


SessionSchema.virtual('userFullName').get(function() {
  return `${this.user.firstName} ${this.user.lastName}`.trim();
});


SessionSchema.methods.serialize = function() {
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


const Session = mongoose.model("sessions", SessionSchema);



module.exports = { Session };