const { User, Blog, Like, Comment, Message } = require('./user');
const jwt = require('jsonwebtoken');
const renv = require('dotenv');
const axios = require('axios')

renv.config({ path: 'config.env' });

const PORT = process.env.PORT || 3000;

// handle errors
module.exports.handleErrors = (err) => {
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const handleErrors = (err) => {
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'backend', {
    expiresIn: maxAge,
  });
};

module.exports.signup_get = (req, res) => {
  res.render('signup');
  res.status(200);
}


module.exports.login = async(req, res) => {
const {email, password} = req.body;
try{
  const user = await User.login(email, password);

  const id = new Date().getDate()
    
  const token = jwt.sign({id, email}, process.env.JWT_SECRET,{expiresIn:'3d'} )

  // res.status(200).json({ accessToken: token})

  res.cookie('token', token, { httpOnly: true, maxAge: maxAge * 1000 });

  userblogs = await axios.get(`http://localhost:${PORT}/get/blogs`).then(function(result){
    return result.data
  }).catch((error) => {
    return error
  })


  // res.status(200).json({msg:'user created', token})

  console.log(userblogs);

  if (email === 'admin@gmail.com'){
    res.redirect('/Dashboard');
  } 
  else{
    res.render('home_login', {blogs:userblogs}); 
  }
  
  
  res.status(200).json({ accessToken: token})
}

catch (err) {
  const errors = handleErrors(err);
  res.render('login_errors', {
    emailerror: errors.email,
    passworderror: errors.password
  })
}}


module.exports.login_get = (req, res) => {
  try {
    res.render('login');
    res.status(200);}
  catch {
    res.status(404)
  }
}

module.exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.redirect('/login');
  }
  catch(err) {
    const errors = handleErrors(err);
    res.render('signup_errors', {
      emailerror: errors.email,
      passworderror: errors.password
    })
  }
 
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id, token });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(404).json({ errors });
  }
};


module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
  res.status(200);
};

module.exports.get_likes = async (req, res) => {
  try {
    const result = await Like.find();
    if (!result) {
      res.json({
        status: 'Failed',
        message: 'Not found record',
      });
    } else {
      res.json({
        status: 'SUCCESS',
        message: 'likes found',
        data: result,
      });
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(404).json({ errors });
  }
};

module.exports.get_comments = async (req, res) => {
  try {
    const result = await Comment.find();
    if (!result) {
      res.json({
        status: 'Failed',
        message: 'Not found record',
      });
    } else {
      res.json({
        status: 'SUCCESS',
        message: 'Records found',
        data: result,
      });
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(404).json({ errors });
  }
};

module.exports.get_messages = async (req, res) => {
  try {
    const result = await Message.find();
    if (!result) {
      res.json({
        status: 'Failed',
        message: 'Not found record',
      });
    } else {
      res.json({
        status: 'SUCCESS',
        message: 'Records found',
        data: result,
      });
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(404).json({ errors });
  }
};

module.exports.get_users = async (req, res) => {
  User.find()
    .then((user) => {
      res.send(user).status(200);
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message || 'Error occured while retrieving user info',
      });
    });
};
module.exports.delete_user = async (req, res) => {
  const id = req.params.id;

  User.findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: `Cannot Delete with id ${id}. Maybe id is wrong` });
      } else {
        res.send({
          message: 'User was deleted successfully!',
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete User with id=' + id,
      });
    });
};

module.exports.update_user = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: 'Data to update can not be empty' });
  }

  const id = req.params.id;
  User.findByIdAndUpdate(id, req.body, { new: true })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot Update user with ${id}. Maybe user not found!`,
        });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: 'Error Update user information' });
    });
};

module.exports.getsingle_user = async (req, res) => {
  const param = req.params.id;
  if (param) {
    const id = param;

    User.findById(id)
      .then((data) => {
        if (!data) {
          res.status(404).send({ message: 'Not found user with id ' + id });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({ message: 'Erro retrieving user with id ' + id });
      });
  } else {
    User.find()
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || 'Error Occurred while retriving user information',
        });
      });
  }
};

module.exports.get_blogs = async (req, res) => {
  const authHeader = req.headers.authorization;
  Blog.find()
    .then((blog) => {
      res.send(blog).status(200);
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message || 'Error occured while retrieving blog info',
      });
    });
};
module.exports.delete_blog = async (req, res) => {
  const id = req.params.id;

  Blog.findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: `Cannot Delete with id ${id}. Maybe id is wrong` });
      } else {
        res.send({
          message: 'Blog was deleted successfully!',
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete blog with id=' + id,
      });
    });
};

module.exports.update_blog = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: 'Data to update can not be empty' });
  }

  const id = req.params.id;
  Blog.findByIdAndUpdate(id, req.body, { new: true })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot Update Blog with ${id}. Maybe Blog not found!`,
        });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: 'Error Update Blog information' });
    });
};

module.exports.getsingle_blog = async (req, res) => {
  const param = req.params.id;
  if (param) {
    const id = param;

    Blog.findById(id)
      .then((data) => {
        if (!data) {
          res.status(404).send({ message: 'Not found blog with id ' + id });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({ message: 'Erro retrieving blog with id ' + id });
      });
  } else {
    Blog.find()
      .then((blog) => {
        res.send(blog);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || 'Error Occurred while retriving blog information',
        });
      });
  }
};

module.exports.getblogs_id = async (req, res) => {
  try {
    const _id = req.params.id;
    const result = await Blog.findById(_id);
    if (!result) {
      res.json({
        status: 'Failed',
        message: 'Not blog found',
      });
    } else {
      res.json({
        status: 'SUCCESS',
        message: 'blog found',
        data: result,
      });
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(404).json({ errors });
  }
};

module.exports.put_blog = async (req, res) => {
  try {
    const _id = req.params.id;
    const result = await Blog.findByIdAndUpdate(_id, req.body, { new: true });
    if (!result) {
      res.json({
        status: 'Failed',
        message: 'Not found record',
        data: result,
      });
    } else {
      res.json({
        status: 'SUCCESS',
        message: 'Records found',
        data: result,
      });
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(404).json({ errors });
  }
};

module.exports.post_blog = async (req, res) => {
  const data = new Blog(req.body);
  const result = await data.save();

  if (!result) {
    res.status(400).json({
      status: 'FAILED',
      message: 'blog not saved',
    });
  } else {
    res.status(200)
  }
};

module.exports.delete_message = async (req, res) => {
  const id = req.params.id;

  Message.findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: `Cannot Delete with id ${id}. Maybe id is wrong` });
      } else {
        res.send({
          message: 'message was deleted successfully!',
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete message with id=' + id,
      });
    });
};

module.exports.post_message = async (req, res) => {
  const data = new Message(req.body);
  const result = await data.save();

  if (!result) {
    res.json({
      status: 'FAILED',
      message: 'Message not saved',
    });
  } else {
    res.json({
      status: 'SUCCESS',
      message: 'Message successfully saved....',
      data: result,
    });
  }
};

module.exports.post_like = async (req, res) => {
  const data = new Like(req.body);
  const result = await data.save();

  if (!result) {
    res.json({
      status: 'FAILED',
      message: 'like not saved',
    });
  } else {
    res.json({
      status: 'SUCCESS',
      message: 'like successfully saved....',
      data: result,
    });
  }
};

module.exports.post_comment = async (req, res) => {
  const data = new Comment(req.body);
  const result = await data.save();

  if (!result) {
    res.json({
      status: 'FAILED',
      message: 'comment not saved',
    });
  } else {
    res.json({
      status: 'SUCCESS',
      message: 'comment successfully saved....',
      data: result,
    });
  }
};
