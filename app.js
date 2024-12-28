require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require('method-override')
const connectDB = require("./server/config/db");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");

// layouts -->> common structure of skeleton of web-pages

// const expressLayouts = require('expressEjsLayouts'); // allow you to create layouts
const app = express();
// USE PORT FROM ENVIRONMENT VARIABLES OR FALLBACK TO 3000
const port = 3000 || process.env.port;

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: { maxAge: 604800000 }, // 7 days session(user will be logged in for approx 7 days, after loogin in)
  })
);

// initialize the passport
app.use(passport.initialize());
app.use(passport.session());
// PASS THE DATA FROM PAGE TO PAGE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"))
// connect to database
connectDB();

// STATIC FILES
app.use(express.static("public")); // used to link html documents

// TEMPLATING ENGINE
app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

// ROUTE
app.use("/", require("./server/routes/index")); // use all the route information here
app.use("/", require("./server/routes/dashboard"));

// AUTH route
app.use("/", require("./server/routes/auth"));
// HANDLE 404
app.get("*", function (req, res) {
  // res.status(404).send('404 page not found')
  res.status(404).render("NotFound");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
