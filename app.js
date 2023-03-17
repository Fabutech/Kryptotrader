// External Modules
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require("ejs");
const mongoose = require('mongoose');

// Own Modules
const otherFunctions = require('./modules/otherFunctions');
const getFunctions = require('./modules/getFunctions');
const postFunctions = require('./modules/postFunctions');

// Express initialization
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Mongoose initialization
mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://fabutech:A1b2C3d4@cluster0.a92liiy.mongodb.net/cryptos");
console.log("Connected to Mongo");

// MongoDB collection setups through the corresponding functions from otherFunctions
const Token = otherFunctions.createToken(mongoose);
const User = otherFunctions.createUser(mongoose);
const Portfolio = otherFunctions.createPortfolio(mongoose);

// GET Requests
// Get request for the root which returns the index page
app.get("/", (req, res) => {
    res.render("index", {wrong: false})
})

app.get("/register", (req, res) => {
    res.render("register", {wrong: 0});
})

app.get("/aaa", (req, res) => {
    res.send(111);
})

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

// Express App listens on localhost:3000
app.listen(3000, function() {
    console.log("Server successfully started on port 3000");
});