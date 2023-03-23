// External Modules
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require("ejs");
const mongoose = require('mongoose');

// Own Modules from /modules
const otherFunctions = require('./modules/otherFunctions');
const getFunctions = require('./modules/getFunctions');
const postFunctions = require('./modules/postFunctions');

// Express initialization with view engine "ejs" and the static files in the public directory, as well as body-parser enabled
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Mongoose initialization and connection to the database
mongoose.set('strictQuery', false);
mongoose.connect("db_connection_link");
console.log("Connected to Mongo");

// MongoDB collection setups through the corresponding functions from otherFunctions
const Token = otherFunctions.createToken(mongoose);
const User = otherFunctions.createUser(mongoose);
const Portfolio = otherFunctions.createPortfolio(mongoose);

// GET Requests
// Get request for the root which renders the index page for the user login
app.get("/", (req, res) => {
    res.render("index", {wrong: false})
})

// Get request for the /register page which renders the registration page
app.get("/register", (req, res) => {
    res.render("register", {wrong: 0});
})

// Get requests for all the different pages when logged in
// All get requests end with /:userId => The link the get request is made to ends with the user id (which is stored in the database)
// This link makes it possible to check wether or not the user exists and to display the user specific content
// The corresponding function from getFunctions is being called
app.get("/dashboard/:userId", (req, res) => {
    getFunctions.getDashborard(req, res, User, Token, Portfolio);
})
app.get("/cryptos/:userId", (req, res) => {
    getFunctions.getCryptos(req, res, User, Token);
})
app.get("/portfolio/:userId", (req, res) => {
    getFunctions.getPortfolio(req, res, User, Token, Portfolio);
})
app.get("/orderbook/:userId", (req, res) => {
    getFunctions.getOrderbook(req, res, User);
})
app.get("/exchange/:userId", (req, res) => {
    getFunctions.getExchange(req, res, User, Token, Portfolio);
})
app.get("/deposit/:userId", (req, res) => {
    getFunctions.getDeposit(req, res, User);
})

// POST Request
// Post requests for all forms that are in the html/ejs pages which will all call the corresponding functions from the postFunctions
app.post("/login", (req, res) => {
    postFunctions.postLogin(req, res, User);
})

app.post("/register", (req, res) => {
    postFunctions.postRegister(req, res, User, Portfolio);
})

app.post("/deposit", (req, res) => {
    postFunctions.postDeposit(req, res, User);
})

app.post("/buy", (req, res) => {
    postFunctions.postBuy(req, res, User, Token, Portfolio)
})

app.post("/sell", (req, res) => {
    postFunctions.postSell(req, res, User, Token, Portfolio)
})

// Express App listens on the specified port
app.listen(3000, function() {
    console.log("Server successfully started on port 3000");
});
