const update = {
    assets: [{
            token: "XRP",
            amount: 10
        },
        {
            token: "BNB",
            amount: 6
        },
        {
            token: "Ethereum",
            amount: 3
        },
    ]}
Portfolio.findOneAndUpdate({user: "6412470181354ca540eee415"}, update, (err, _) => {})

const update1 = {
    transactions: [
    {
        date: new Date(),
        transaction_type: "Sell Crypto",
        currency: "BTC",
        price_at_time: "$24,385.60",
        balance_change_crypto: "-1.00",
        balance_change_usd: "+24385.60"
    },
    {date: new Date(),transaction_type: "Buy Crypto",currency: "BTC",price_at_time: "$24,385.60",balance_change_crypto: "+1.00",balance_change_usd: "-24385.60"},
    {date: new Date(),transaction_type: "Deposit $USD",currency: "$USD",price_at_time: "$1.00",balance_change_crypto: "none",balance_change_usd: "+200.00"}]}
User.find({_id: "6412470181354ca540eee415"}, (err, h) => {console.log(h);})
User.findOneAndUpdate({_id: "6412470181354ca540eee415"}, update1, (err, h) => {console.log(err, h);})