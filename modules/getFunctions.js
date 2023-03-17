
function getDashborard(req, res, User, Token, Portfolio) {
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
                    res.render("portfolio", {userId: userId, portfolioTokens: portfolios, username: foundUser.username})
                })
            })
        }
    })
}

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

module.exports = {
    getDashborard: getDashborard,
    getCryptos: getCryptos,
    getPortfolio: getPortfolio,
    getOrderbook: getOrderbook,
    getExchange: getExchange,
    getDeposit: getDeposit
}