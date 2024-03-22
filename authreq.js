const jwt = require('jsonwebtoken');
const User = require('./user');
const dotenv = require('dotenv');
const error_handler = require('./authmain')

dotenv.config({ path: 'config.env' });

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'backend', (err, decodedToken) => {
      if (err) {
        ('pass');
      } else {
        // console.log(decodedToken);
        next();
      }
    });
  } else {
    // res.redirect('/login');
    ('pass');
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'backend', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        // console.log(decodedToken.id);
        // console.log(user.email);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

const preventUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'backend', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null; 
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        if (user.email != 'admin@gmail.com') {
          res.status(400).json({ error: 'Login as Admin' });
        }
        res.locals.user = user;
        return;
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if(!authHeader || !authHeader.startsWith('Bearer')){
    res.send({
      message: 'Login please',
    });
    return
  }

  const token = authHeader.split(' ')[1]
  
  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
  } catch (error) {
    const errors = error_handler.handleErrors(error);
    res.status(404).json({ errors });
  } 
  next()
}

const AdminauthenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if(!authHeader || !authHeader.startsWith('Bearer')){
    res.send({
      message: 'Login please',
    });
    return
  }
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token,process.env.JWT_SECRET);
  
  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    console.log(decoded.email)
  } catch (error) {
    const errors = error_handler.handleErrors(error);
    res.status(404).json({ errors });
  } 
  const admin_email = decoded.email
  if(admin_email != 'admin@gmail.com'){
    res.send({
      message: 'Login as Admin',
    });
    return
  }
  next()
}
module.exports = {authenticationMiddleware, AdminauthenticationMiddleware}
