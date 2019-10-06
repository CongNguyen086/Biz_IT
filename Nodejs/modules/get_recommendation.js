const fs = require('fs')

const findTransactionOfUserId = (Id) => {
    const jsonString = fs.readFileSync('./json/transaction.json');
    const jsonData = JSON.parse(jsonString);
    let numberOfTransactions = 0;
    jsonData.forEach(element => {
        if (element.user_id == Id) {
            numberOfTransactions += 1;
        }
    });
    if(numberOfTransactions < 0) {
        return null;
    }
    else return recommendation(Id);
}

const recommendation = (userId) => {
    let jsonString = fs.readFileSync('./json/recommendation.json');
    let jsonData = JSON.parse(jsonString);
    let recommendData = [];

    jsonData.forEach(element => {
        if (element.user_id == userId) {
            recommendData.push(element);
        }
    })
    console.log(recommendData);
    return recommendData;
}

module.exports = findTransactionOfUserId