const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const fs = require('fs');
const findTransactionOfUserId = require('./modules/get_recommendation.js')

const geolib = require('geolib');

//

const app = express()

app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'sa123',
    database: 'bit_system',
    port: '3306',
    multipleStatements: true
});

connection.connect((error) => {
    if (!error) {
        console.log('Connect database succeeded')
    } else
        console.log('Connect database failed', error)
});

//POST NEW TRANSACTION INTO DATABASE - API 1
app.post('/transaction/post', (req, res) => {
    const transactionTime = req.query.transactionTime
    const userId = req.query.userId
    const storeId = req.query.storeId
    const amount = req.query.amount

    const queryString = 'INSERT INTO transactions (transactionsTime, userId, storeId, amount) VALUES (?, ?, ? ,?)'
    connection.query(queryString, [transactionTime, userId, storeId, amount], (error, rows, fields) => {
        if (!error) {
            res.send('Insert into transactions successfully')
            console.log(rows)
        } else console.log(error);
    })
})

//GET RECOMMENDATION FROM DATABASE - API 4
app.get('/recommendation', (req, res) => {
    connection.query('SELECT * FORM recommendation', (error, rows, fields) => {
        if (!error) {
            res.send(rows)
        } else console.log(error)
    })
})

//GET DEAL FROM DATABASE - API 4
app.get('/deal', (req, res) => {
    connection.query('SELECT * FROM deal', (error, rows, fields) => {
        if (!error) {
            res.send(rows)
        } else console.log(error);
    })
});

//POST INFORMATION OF USER WHEN USER CREATE ACCOUNT - API 6
app.post('/login/momo', (req, res) => {
    const userId = req.query.userId
    const fullName = req.query.fullName
    const userPhone = req.query.userPhone
    const password = req.query.password

    const queryString = 'INSERT INTO users (userId, fullName, userPhone, password) VALUES (?, ?, ?, ?)'

    connection.query(queryString, [userId, fullName, userPhone, password], (error, rows, fields) => {
        if (!error) {
            res.send('Insert new account(momo) successfully')
            console.log(rows)
        } else console.log(error)
    })
})
//POST INFORMATION OF USER WHEN USER LOGIN FORM FACEBOOK - API 6
app.post('/login/facebook', (req, res) => {
    const userId = req.query.userId
    const fullName = req.query.fullName

    const queryString = 'INSERT INTO users (userId, fullName) VALUES (?, ?)'

    connection.query(queryString, [userId, fullName], (error, rows, fields) => {
        if (!error) {
            res.send('Insert new account(facebook) successfully')
            console.log(rows)
        } else console.log(error)
    })
})

//GET STORE FROM ID
app.get('/store', (req, res) => {
    connection.query('SELECT * FROM stores WHERE storeId = ?', [req.query.userId], (error, rows, fields) => {
        if (!error) {
            res.send(rows)
        } else console.log(error);
    })
})

//GET TRANSACTIONS OF USER_ID
app.get('/transaction/check', (req, res) => {
    const userId = req.query.userId
    const services = findTransactionOfUserId(userId)
    console.log(services)
})

//GET USER_ID AND ADD INSERT INTO USERS DATABASE
app.get('/users', (req, res) => {
    const userId = req.query.userId
    let jsonString = fs.readFileSync('./json/recommendation.json');
    let jsonData = JSON.parse(jsonString);
    jsonData.forEach(element => {
        if (element.user_id == userId) {
            const queryString = 'INSERT INTO recommendation (userId, serviceId, point) VALUES (?, ?, ?)'
            connection.query(queryString, [element.user_id, element.service_id, element.rank], (error, rows, fields) => {
                if (!error) {
                    console.log(rows)
                } else console.log(error)
            })
        }
    })
    connection.query('SELECT * FROM recommendation WHERE userId = ?', [userId], (error, rows, fields) => {
        if (!error) {
            res.send(rows)
        } else console.log(error);
    })
})

// UserId: 8159657106479438377
app.get('/getpopulardeal', (req, res) => {
    connection.query('CALL GetPopularDeal()', (error, rows, fields) => {
        if (!error) {
            res.send(rows)
        } else console.log(error);
    })
})

app.get('/getrecommendeddeal', (req, res) => {
    const userId = req.query.userId
    connection.query('CALL GetRecommendedDeal(?)', [userId], (error, rows, fields) => {
        if (!error) {
            res.send(rows)
        } else console.log(error);
    })
})

//2 6683159578094575932 
app.get('/getstorepromotion', (req, res) => {
    const dealId = req.query.dealId
    connection.query('CALL GetStorePromotion(?)', [dealId], (error, rows, fields) => {
        if (!error) {
            var string = JSON.stringify(rows);
            var jsonRows = JSON.parse(string);
            var string2 = JSON.stringify(rows);
            var jsonRows2 = JSON.parse(string);
            res.send(jsonRows[0])
        } else console.log(error);
    })
})

app.get('/gettimerecommendationdeal', (req, res) => {
    const userId = req.query.userId
    let today = new Date();
    let current_time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    connection.query('CALL GetTimeRecommendationDeal(?, ?)', [userId, current_time], (error, rows, fields) => {
        if (!error) {
            res.send(rows)
            console.log(current_time)
        } else console.log(error);
    })
})

app.get('/login', (req, res) => {
    const phone = req.query.phone
    const password = req.query.password

    connection.query('SELECT * FROM users Where (userPhone = ? AND userPassword = ?)', [phone, password], (error, rows, fields) => {
        if (!error) {
            res.send(rows)
        } else console.log(error);
    })
})


app.listen(3000, () => {
    console.log('Server is starting')
})

