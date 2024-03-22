const { Router } = require("express");
const axios = require("axios");
const authController = require("./authmain");
const authMiddleware = require("./authreq");
const router = Router();
const myenv = require('dotenv');
const jtoken = require('jsonwebtoken');



myenv.config({ path: 'config.env' });

const PORT = process.env.PORT || 3000;


router.post("/signup", authController.signup);
router.get("/signup", authController.signup_get);
router.post("/user/login", authController.login_post);
router.post("/login", authController.login);
router.get("/login", authController.login_get);
router.get("/user/logout", authMiddleware.AdminauthenticationMiddleware, authController.logout_get);
router.get("/get/blogs", authController.get_blogs);
router.get(
  "/get/blogs/:id",
  authMiddleware.AdminauthenticationMiddleware,
  authController.getsingle_blog
);
router.get(
  "/get/messages",
  authMiddleware.AdminauthenticationMiddleware,
  authController.get_messages
);
router.get(
  "/get/comments",
  authController.get_comments
);
router.get(
  "/get/likes",
  authController.get_likes
);
router.get("/get/users", authController.get_users);
router.get(
  "/get/user/:id",
  authMiddleware.AdminauthenticationMiddleware,
  authController.getsingle_user
);
router.put("/update/user/:id", authController.update_user);
router.delete("/delete/user/:id", authController.delete_user);
router.post("/post/blog", authController.post_blog);
router.post("/post/message", authController.post_message);
router.post(
  "/post/like",
  authController.post_like
);
router.post("/post/comment", authController.post_comment);
router.put("/update/blog/:id", authController.update_blog);
router.delete(
  "/delete/blog/:id",
  authController.delete_blog
);
router.delete("/delete/message/:id", authController.delete_message);

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/Dashboard", (req, res) => {
  const token = req.cookies.token;
  const decoded = jtoken.verify(token,process.env.JWT_SECRET);
  const email = decoded.email
  if(email != 'admin@gmail.com'){
    res.send('Login as Admin')
  }
  Promise.all([
    axios.get(`http://localhost:${PORT}/get/users`, {
      headers: {
        Authorization: `Bearer ${req.cookies.token}`,
      },
    }),
    axios.get(`http://localhost:${PORT}/get/blogs`, {
      headers: {
        Authorization: `Bearer ${req.cookies.token}`,
      },
    }),
    axios.get(`http://localhost:${PORT}/get/messages`, {
      headers: {
        Authorization: `Bearer ${req.cookies.token}`,
      },
    }),
  ])
    .then(function (response) {
      res.render("index", {
        users: response[0].data,
        blogs: response[1].data,
        messages: response[2].data,
      });
    })
    .catch((error) => {
      res.send(error);
    });
});

router.get("/update-user", (req, res) => {
  axios
    .get(`http://localhost:${PORT}/update/user`, { params: { id: req.query.id } })
    .then(function (userdata) {
      res.render("update_user", { user: userdata.data });
    })
    .catch((err) => {
      res.send(err);
    });
});

router.get("/update-blog", (req, res) => {
  axios
    .get(`http://localhost:${PORT}/update/blog`, { params: { id: req.query.id } })
    .then(function (userdata) {
      res.render("update_blog", { blog: userdata.data });
    })
    .catch((err) => {
      res.send(err);
    });
});

router.get("/add-user", (req, res) => {
  res.render("add_user", { users: "New Data" });
});

router.get("/add-blog", (req, res) => {
  res.render("add_user", { users: "New Data" });
});

module.exports = router;
