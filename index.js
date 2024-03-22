const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const authRoutes = require('./authroutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser, preventUser } = require('./authreq');

const app = express();

dotenv.config({ path: 'config.env' });
const PORT = process.env.PORT || 3000;

app.use(morgan('tiny'));

app.use(bodyparser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// app.set("views", path.resolve(__dirname, "views/ejs"))

//load assets
app.use('/css', express.static(path.resolve(__dirname, 'assets/css')));
app.use('/img', express.static(path.resolve(__dirname, 'assets/img')));
app.use('/js', express.static(path.resolve(__dirname, 'assets/js')));

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// database connection
const dbURI =
  //'mongodb+srv://inkkelly:kelly.j.ke@cluster0.v4ttnn7.mongodb.net/personalweb?retryWrites=true&w=majority';
   //'mongodb+srv://inkkelly6:nAiOu4yJTQPbHuVb@portfolio.x5efnbq.mongodb.net/';
   'mongodb+srv://inkkelly6:nAiOu4yJTQPbHuVb@portfolio.x5efnbq.mongodb.net/?retryWrites=true&w=majority&appName=portfolio';
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) =>
    app.listen(PORT, () => console.log(`The server is running on port ${PORT}`))
  )
  .catch((err) => console.log(err));

// routes
// app.get('*', checkUser);
// app.use(preventUser, '/get/blogs');
// app.use(preventUser, '/get/blogs/:id');
// app.use(preventUser, '/get/messages');
// app.use(preventUser, '/get/users');
// app.use(preventUser, '/post/blog');
// app.use(preventUser, '/put/blogs/:id');
// app.use(preventUser, '/delete/blogs/:id');

// app.use(preventUser, authRoutes);
app.use(authRoutes);



