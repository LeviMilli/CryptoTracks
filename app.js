// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();
app.use(express.json());

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// default value for title local
const capitalized = require("./utils/capitalized");
const projectName = "rootcrypto";

app.locals.appTitle = `${capitalized(projectName)} created with CryptoRoot`;

const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");

app.use(
  session({
    secret: "charmander",
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified
    cookie: {
      maxAge: 1000 * 24 * 60 * 60,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI || "mongodb://localhost/rootcrypto",
      ttl: 24 * 60 * 60, // = 1 days.
    }),
  })
);

// 👇 Start handling routes here
const index = require("./routes/index.routes");
app.use("/", index);

const pages = require("./routes/pages.routes");
app.use("/", pages);

const auth = require("./routes/auth.routes");
app.use("/", auth);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
