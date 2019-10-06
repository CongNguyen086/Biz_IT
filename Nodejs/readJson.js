const fs = require('fs');

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

recommendation(513855241411642)
// let numberOfTransactions = 0;

// const findTransactionOfUserId = (userId) => {
//     jsonData.forEach(element => {
//         if(element.user_id == userId) {
//             numberOfTransactions += 1;
//         }
//     });
//     console.log(numberOfTransactions)
// }

// findTransactionOfUserId(3957778073102130570)