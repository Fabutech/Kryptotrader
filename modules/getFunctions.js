// GET Request functions

// function which handles the get request for the dashboard page and in the end renders the corresponding page
// The corresponding user data is loaded from the users collection of the db (if the user doesn't exist, an error page will be rendered)
// The portfolio of the User is loaded from the portfolio collection of the db and the tokens included in the portfolio are loaded from the db as well
// A new array with the data for displaying the portfolio is created and finally the dashboard page gets rendered and all the above data is sent with it 
function getDashborard(req, res, User, Token, Portfolio) {
    // userId is loaded from the request link
    const userId = req.params.userId;
    const userAssets = [];
    let userAssetsAmounts = {};

    User.findById(userId, (err, foundUser) => {
        if (foundUser == null) {
            res.render("error", {})
        } else {
            Portfolio.findOne({user: userId}, (err, portfolio) => {
                portfolio.assets.forEach((asset) => {
                    userAssets.push(asset.token);
                    userAssetsAmounts[asset.token] = asset.amount;
                })
                Token.find({'name_short': { $in: userAssets}}, (err, portfolioTokens) => {
                    const portfolios = [];
                    portfolioTokens.forEach((token) => {
                        portfolios.push({
                            ranked: token.ranked,
                            token_logo_img: token.token_logo_img,
                            name: token.name,
                            name_short: token.name_short,
                            price: token.price,
                            amount: userAssetsAmounts[token.name_short],
                            value: userAssetsAmounts[token.name_short] * Number(token.price.substring(1).replace(",", ""))
                        });
                    })
                    res.render("dashboard", {
                        userId: userId, 
                        username: foundUser.username, 
                        balance: foundUser.balance, 
                        crypto_value: foundUser.crypto_balance,
                        portfolioTokens: portfolios, 
                        username: foundUser.username
                    })
                    // del
                })
            })
        }
    })
}

// function which handles the get request for the cryptos page and in the end renders the corresponding page
// Checks wether the user exists and then loads all tokens from the tokens collection of the db and renders the cryptos page with the loaded data
function getCryptos(req, res, User, Token) {
    const userId = req.params.userId;

    User.findById(userId, (err, foundUser) => {
        if (foundUser == null) {
            res.render("error", {})
        } else {
            Token.find({}, (err, tokens) => {
                res.render("cryptos", {tokens: tokens, userId: userId, username: foundUser.username})
            });
        }
    })
}

// function which handles the get request for the portfolio page and in the end renders the corresponding page
// Checks wether the user exists and then loads the portfolio of the user from the db to get all the tokens that are contained in the users portfolio
// The tokens that are in the users portfolio are then loaded from the db and pushed into a array
// The portfolio page is rendered and the loaded tokens are sent with it
function getPortfolio(req, res, User, Token, Portfolio) {
    const userId = req.params.userId;
    const userAssets = [];

    User.findById(userId, (err, foundUser) => {
        if (foundUser == null) {
            res.render("error", {})
        } else {
            Portfolio.findOne({user: userId}, (err, portfolio) => {
                portfolio.assets.forEach((asset) => {
                    userAssets.push(asset.token);
                })
                Token.find({'name_short': { $in: userAssets}}, (err, portfolioTokens) => {
                    res.render("portfolio", {userId: userId, portfolioTokens: portfolioTokens, username: foundUser.username})
                })
            })
        }
    })
}

// function which handles the get request for the orderbook page and in the end renders the corresponding page
// Checks wether the user exists and the renders the orderbook page with the transactions that are loaded from the users collection
function getOrderbook(req, res, User) {
    const userId = req.params.userId;

    User.findById(userId, (err, foundUser) => {
        if (foundUser == null) {
            res.render("error", {})
        } else {
            res.render("orderbook", {transactions: foundUser.transactions, userId: userId, username: foundUser.username})
        }
    })
}

// function which handles the get request for the exchange page and in the end renders the corresponding page
// Checks wether the user exists and then loads all tokens from the db as well as the users portfolio
// The exchange page is rendered and the tokens and portfolio are sent with it
function getExchange(req, res, User, Token, Portfolio) {
    const userId = req.params.userId;
    let tokens = {};

    User.findById(userId, (err, foundUser) => {
        if (foundUser == null) {
            res.render("error", {})
        } else {
            Token.find({}, (err, foundTokens) => {
                foundTokens.forEach((token) => {
                    tokens[token.name_short] = token.price;
                })
                console.log(tokens);
                Portfolio.findOne({user: foundUser._id}, (err, foundPortfolio) => {
                    res.render("exchange", {userId: userId, username: foundUser.username, userBalance: foundUser.balance, portfolio: foundPortfolio.assets, tokens: foundTokens, token_dir: tokens, action: 0})      
                })
            })
        }
    })
}

// function which handles the get request for the deposit page and in the end renders the corresponding page
// Checks wether the user exists and then renders the deposit page
function getDeposit(req, res, User) {
    const userId = req.params.userId;

    User.findById(userId, (err, foundUser) => {
        if (foundUser == null) {
            res.render("error", {})
        } else {
            res.render("deposit", {userId: userId, deposited: false, username: foundUser.username})
        }
    })
}

// The functions are being exported so they can be imported from app.js/server.js
module.exports = {
    getDashborard: getDashborard,
    getCryptos: getCryptos,
    getPortfolio: getPortfolio,
    getOrderbook: getOrderbook,
    getExchange: getExchange,
    getDeposit: getDeposit
}