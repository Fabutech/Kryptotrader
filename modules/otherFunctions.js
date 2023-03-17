// Functions for creating the Database Objects

// Function which creates a schema for the tokens collection from the database and then with that schema creates a object of that collection and returns it
function createToken(mongoose) {
    const tokenSchema = {
        name: String,
        time_scraped: String,
        name_short: String,
        price: String,
        ranked: Number,
        token_logo_img: String,
        last_hour: String,
        last_day: String,
        last_week: String,
        market_cap: String,
        volume_24h: String,
        circulating_supply: String,
        chart_last_week_img: String
    }
    const Token = mongoose.model("Token", tokenSchema);
    return Token;
}

// Function which creates a schema for the users collection from the database and then with that schema creates a object of that collection and returns it
function createUser(mongoose) {
    const userSchema = {
        username: String,
        pw: String,
        balance: Number,
        crypto_balance: Number,
        created_on: Date,
        transactions: [
            {
                date: String,
                transaction_type: String,
                currency: String,
                price_at_time: String,
                balance_change_crypto: String,
                balance_change_usd: String
            }
        ]
    }
    const User = mongoose.model("User", userSchema);
    return User;
}

// Function which creates a schema for the portfolios collection from the database and then with that schema creates a object of that collection and returns it
function createPortfolio(mongoose) {
    const portfolioSchema = {
        user: String,
        assets: [
            {
                token: String,
                amount: Number
            }
        ]
    }
    const Portfolio = mongoose.model("Portfolio", portfolioSchema);
    return Portfolio;
}

// The functions are being exported so they can be imported from app.js/server.js
module.exports = {
    createToken: createToken,
    createUser: createUser,
    createPortfolio: createPortfolio
}