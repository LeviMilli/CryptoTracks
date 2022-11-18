const router = require("express").Router();
const bcrypt = require("bcryptjs");
const UserModel = require("../models/User.model");

// render signup.hbs
router.get("/signup", (req, res) => {
  res.render("auth/signup.hbs");
});

// render login.hbs
router.get("/login", (req, res) => {
  res.render("auth/login.hbs");
});

// singup info gather from signup page. comes through req, access through req.body
router.post("/signup", (req, res, next) => {
  const { username, email, password } = req.body;
  console.log(req.body);

  const salt = bcrypt.genSaltSync(10);
  console.log(salt);
  const hash = bcrypt.hashSync(password, salt);

  if (!username || !email || !password) {
    res.render("auth/signup.hbs", {
      error: "Please enter all three information",
    });
    return;
  }

  //check email in right format
  let emailRegex =
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/;
  if (!emailRegex.test(email)) {
    res.render("auth/signup.hbs", {
      error: "Please enter a valid email address",
    });
    return;
  }

  // check if password is strong
  var passRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );
  if (!passRegex.test(password)) {
    res.render("auth/signup.hbs", {
      error: `Please enter a strong password with 8 characters that includes 
           -  at least 1 lowercase character
           -  at least 1 uppercase character
           -  at least 1 numeric character
           -  at least 1 special character
           `,
    });
    return;
  }

  UserModel.create({ username, email, password: hash })
    .then(() => {
      res.redirect("/login");
    })
    .catch((err) => {
      next(err);
    });
});

// login credentials check through req.body
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  UserModel.find({ email })
    .then((users) => {
      console.log(users);
      if (users.length) {
        let hashPass = users[0].password;
        if (bcrypt.compareSync(password, hashPass)) {
          req.session.loggedInUser = users[0];
          res.redirect("/profile");
        } else {
          res.render("auth/login.hbs", { error: "Incorrect Password" });
          return;
        }
      } else {
        res.render("auth/login.hbs", { error: "User not found" });
        return;
      }
    })
    .catch((err) => {
      next(err);
    });
});

// logout page rendering

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    } else {
    res.redirect("/"); 
  }

  });
});

// checks user logged in

// function checkUser(req, res, next){
//     if (req.session.loggedInUser ) {
//         next()
//     }
//     else {
//         res.redirect('/login')
//     }
// }

module.exports = router;
