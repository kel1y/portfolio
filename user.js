const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  },
});

const blogSchema = new mongoose.Schema({
  topic: {
    type: String,
  },
  title: {
    type: String,
    required: [true, 'specify the title'],
  },
  content: {
    type: String,
    required: [true, 'Please specify the content'],
  },
  status: {
    type: String,
  },
});

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    // unique: true,
    // lowercase: true,
  },

  email: {
    type: String,
    // unique: true,
    // lowercase: true,
  },
  content: {
    type: String,
  },
  status: {
    type: String,
  },
});

const likeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'provide email'],
    unique: true,
    lowercase: true,
  },
});

const commentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'provide email'],
    unique: true,
    lowercase: true,
  },
});

// fire a function before doc saved to db
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};

const User = mongoose.model('user', userSchema);
const Blog = mongoose.model('blog', blogSchema);
const Message = mongoose.model('message', messageSchema);
const Like = mongoose.model('like', likeSchema);
const Comment = mongoose.model('comment', commentSchema);

module.exports = { User, Blog, Message, Like, Comment };
