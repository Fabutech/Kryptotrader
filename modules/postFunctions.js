// POST Request functions

// function which handles the post request for the login page and in the end redirects to the dashboard page
// Checks wether the username that is entered exists and the corresponding password is correct and then redirects to the dashboard page
function postLogin(req, res, User) {
    const username = req.body.username;
    const pw = req.body.password;
    User.findOne({username: username}, (err, foundUser) => {
        if (!err) {
            if (foundUser == null) {
                res.render("index", {wrong: 1});
            } else {
                if (foundUser.pw == pw) {
                    res.redirect("/dashboard/" + foundUser._id);
                } else {
                    res.render("index", {wrong: true});
                }
            }
        }
    })
}

// function which handles the post request for the register page and in the end redirects to the dashboard page
// Checks wether the two passwords are equal, if not renders the register page again with a warning message
// Checks wether the username already exists, if yes renders the register page again with a warning message
// Creates a new User and Portfolio object with all the corresponding data abd then saves the objects to the db
// Redirects to the dashboard page
function postRegister(req, res, User, Portfolio) {
    const username = req.body.username;
    const pw1 = req.body.pw1;
    const pw2 = req.body.pw2;

    if (pw1 != pw2) {
        res.render("register", {wrong: true});
    } else {
        User.findOne({username: username}, (err, foundUser) => {
            if (!err) {
                if (foundUser != null) {
                    res.render("register", {wrong: 2});
                } else {
                    const newUser = new User({
                        username: username,
                        pw: pw1,
                        balance: 0,
                        crypto_balance: 0,
                        transactions: [],
                        created_on: new Date().toLocaleString()
                    })
                    newUser.save();
                    const newPortfolio = new Portfolio({
                        user: newUser._id,
                        assets: []
                    })
                    newPortfolio.save();

                    res.redirect("/dashboard/" + newUser._id);
                }
            }
        })
    }
}

// function which handles the post request for the deposit page and in the end renders the deposit page
// Loads the transactions of the User into a array and inserts the new transaction at the front of that array
// Updates the data of the corresponding user (balance and transactions) and then renders the deposit page again
function postDeposit(req, res, User) {
    const userId = req.body.userId;
    const deposit_amount = Number(req.body.deposit_amount);

    User.findById(userId, (err, foundUser) => {
        const newTransactions = foundUser.transactions;
        newTransactions.unshift({
            date: new Date().toLocaleString(),
            transaction_type: "Deposit $USD",
            currency: "$USD",
            price_at_time: "$1.00",
            balance_change_crypto: "none",
            balance_change_usd: "+" + deposit_amount
        });
        const update = {
            balance: Number(foundUser.balance)+deposit_amount,
            transactions: newTransactions
        }
        User.findOneAndUpdate({_id: userId}, update, (err, _) => {});
        res.render("deposit", {userId: userId, deposited: true, username: foundUser.username})
    })
}

// function which handles the post request for the buy part of the exchange page and in the end renders the exchange page
// Loads the corresponding token that is bought from the db as well as the users Portfolio
// Checks wether the amount doesn't exceed the users balance and then saves a new transaction into the users transaction 
// Then the portfolio of the user is being updated (a new asset is inserted or if it already exists updated)
// Finally the exchange page is being rendered again
function postBuy(req, res, User, Token, Portfolio) {
    const amount = req.body.amount;
    const crypto = req.body.cryptos;
    const userId = req.body.userId;

    console.log(amount, crypto, userId);

    User.findById(userId, (err, foundUser) => {
        Token.findOne({name_short: crypto}, (err, foundToken) => {
            const newTransactions = foundUser.transactions;
            console.log(Number(amount), Number(foundToken.price.substring(1).replace(",", "")), (Number(amount) / Number(foundToken.price.substring(1).replace(",", ""))));
            newTransactions.unshift({
                date: new Date().toLocaleString(),
                transaction_type: "Buy Crypto",
                currency: crypto,
                price_at_time: foundToken.price,
                balance_change_crypto: "+" + Number(amount) / Number(foundToken.price.substring(1).replace(",", "")),
                balance_change_usd: "-" + amount
            });
            

            Portfolio.findOne({user: userId}, (err, foundPortfolio) => {
                if (User.balance-Number(amount) < 0) {
                    alert("You don't have enough money for that transaction!");
                    Token.find({}, (err, foundTokens) => {
                        res.render("exchange", {userId: userId, username: foundUser.username, userBalance: foundUser.balance, portfolio: foundPortfolio.assets, tokens: foundTokens, action: -1})
                    })
                }

                User.findOneAndUpdate({_id: userId}, {
                    balance: foundUser.balance-Number(amount),
                    crypto_balance: foundUser.crypto_balance+Number(amount),
                    transactions: newTransactions
                }, (err, u) => {})

                const new_assets = [];
                let ex = 0;
                foundPortfolio.assets.forEach((asset) => {
                    if (asset.token == crypto) {
                        ex = 1;
                        new_assets.push({
                            token: asset.token,
                            amount: asset.amount + (Number(amount) / Number(foundToken.price.substring(1).replace(",", "")))
                        })
                    } else {
                        new_assets.push(asset);
                    }
                })
                if (ex == 0) {
                    new_assets.push({
                        token: crypto,
                        amount: (Number(amount) / Number(foundToken.price.substring(1).replace(",", "")))
                    })
                }
                let tokens = {};

                Portfolio.findOneAndUpdate({user: userId}, {assets: new_assets}, (err, _) => {});
                Token.find({}, (err, foundTokens) => {
                    foundTokens.forEach((token) => {
                        tokens[token.name_short] = token.price;
                    })
                    res.render("exchange", {userId: userId, username: foundUser.username, userBalance: foundUser.balance, portfolio: foundPortfolio.assets, tokens: foundTokens, action: 1})
                })
            })
        })
    })
}

// function which handles the post request for the sell part of the exchange page and in the end renders the exchange page
// Loads the corresponding token that is bought from the db as well as the users Portfolio
// Saves a new transaction into the users transaction 
// Then the portfolio of the user is being updated (amount of the corresponding currency is adjusted)
// Finally the exchange page is being rendered again
function postSell(req, res, User, Token, Portfolio) {
    const amount = req.body.amount;
    const crypto = req.body.cryptos;
    const userId = req.body.userId;

    User.findById(userId, (err, foundUser) => {
        Token.findOne({name_short: crypto}, (err, foundToken) => {
            const newTransactions = foundUser.transactions;
            console.log(Number(amount), Number(foundToken.price.substring(1).replace(",", "")), (Number(amount) * Number(foundToken.price.substring(1).replace(",", ""))));
            newTransactions.unshift({
                date: new Date().toLocaleString(),
                transaction_type: "Sell Crypto",
                currency: crypto,
                price_at_time: foundToken.price,
                balance_change_crypto: "-" + amount,
                balance_change_usd: "+" + Number(amount) * Number(foundToken.price.substring(1).replace(",", "")),
            });
            

            Portfolio.findOne({user: userId}, (err, foundPortfolio) => {

                User.findOneAndUpdate({_id: userId}, {
                    balance: foundUser.balance+Number(amount) * Number(foundToken.price.substring(1).replace(",", "")),
                    crypto_balance: foundUser.crypto_balance-Number(amount) * Number(foundToken.price.substring(1).replace(",", "")),
                    transactions: newTransactions
                }, (err, u) => {})

                const new_assets = [];

                foundPortfolio.assets.forEach((asset) => {
                    if (asset.token == crypto) {
                        new_assets.push({
                            token: asset.token,
                            amount: asset.amount - Number(amount)
                        })
                    } else {
                        new_assets.push(asset);
                    }
                })
                let tokens = {};

                Portfolio.findOneAndUpdate({user: userId}, {assets: new_assets}, (err, _) => {});
                Token.find({}, (err, foundTokens) => {
                    foundTokens.forEach((token) => {
                        tokens[token.name_short] = token.price;
                    })
                    res.render("exchange", {userId: userId, username: foundUser.username, userBalance: foundUser.balance, portfolio: foundPortfolio.assets, tokens: foundTokens, action: 2})
                })
            })
        })
    })
}

// The functions are being exported so they can be imported from app.js/server.js
module.exports = {
    postLogin: postLogin,
    postRegister: postRegister,
    postDeposit: postDeposit,
    postBuy: postBuy,
    postSell: postSell
}