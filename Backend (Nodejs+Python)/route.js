const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser');
const multer = require('multer');

// mysql://bb0fa2c19d3675:8fbf3bba@us-cdbr-iron-east-05.cleardb.net/heroku_35c3d24bcc95fd7?reconnect=true

const app = express()

app.use(bodyParser.json());
// app.use(express.static('upload'));
app.use(express.static(__dirname + '/uploads'));

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Khang20.09',
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

//GET DEAL FROM DATABASE - API 4
app.get('/deal', (req, res) => {
    connection.query('SELECT * FROM deal', (error, rows, fields) => {
        if (!error) {
            res.send(rows)
        } else console.log(error);
    })
});

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
            // console.log(current_time)
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

app.get('/getusercash', (req, res) => {
    const userId = req.query.userId

    connection.query('SELECT userCash FROM users WHERE userId = ?', [userId], (error, rows, fields) => {
        if(!error) {
            res.send(rows)
        } else console.log(error)
    })
})

app.put('/putusercash', (req, res) => {
    const cash = req.query.cash
    const userId = req.query.userId

    connection.query('UPDATE users SET userCash = ? WHERE userId = ?', [cash, userId], (error, rows, fields) => {
        if(!error) {
            res.send(rows)
        } else console.log(error);
    })
})

app.post('/sendreview', (req, res) => {
    const rating = req.query.rating
    const comment = req.query.comment
    const userId = req.query.userId
    const storeId = req.query.storeId

    const queryString = 'INSERT INTO review (reviewRating, reviewComment, userId, storeId) VALUES (?, ?, ? ,?)'
    connection.query(queryString, [rating, comment, userId, storeId], (error, rows, fields) => {
        if (!error) {
            res.send(rows)
            console.log(rows)
        } else console.log(error);
    })
})

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

var upload = multer({
    limits: {
        fieldSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    },
    storage: storage
});

app.post('/upload', upload.single('upload'), (req, res) => {
    const reviewPhoto = req.file.path
    const reviewId = req.query.reviewId

    const queryString = 'INSERT INTO review_image (reviewPhoto, reviewId) VALUES (?, ?)'
    connection.query(queryString, [reviewPhoto, reviewId], (error, rows, fields) => {
        if (!error) {
            res.send(rows)
        } else console.log(error);
    })

}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

app.get('/getreview', (req, res) => {
    const storeId = req.query.storeId

    connection.query('SELECT reviewId, reviewRating, reviewComment, fullName FROM review INNER JOIN users ON review.userId = users.userId WHERE storeId = ?', [storeId], (error, rows, fields) => {
        if (!error) {
            res.send(rows)
        } else console.log(error)
    })
})

app.get('/getstorerating', (req, res) => {
    const storeId = req.query.storeId

    connection.query('SELECT AVG(review.reviewRating) AS rating FROM stores INNER JOIN review ON stores.storeId = review.storeId WHERE stores.storeId = ?;', [storeId], (error, rows, fields) => {
        if (!error) {
            res.send(rows)
        } else console.log(error)
    })
})

app.put('/updatestorerating', (req, res) => {
    const storeId = req.query.storeId
    const storeRating = req.query.storeRating

    connection.query('UPDATE stores SET storeRating = ?  WHERE storeId = ?;', [storeRating, storeId], (error, rows, fields) => {
        if (!error) {
            res.send(rows)
        } else console.log(error)
    })
})

app.get('/getimage', (req, res) => {
    const reviewId = req.query.reviewId

    connection.query('SELECT review.reviewId, reviewImageId, reviewPhoto FROM review INNER JOIN review_image ON review.reviewId = review_image.reviewId WHERE review.reviewId = ?', [reviewId], (error, rows, fields) => {
        if (!error) {
            res.send(rows)
        } else console.log(error)
    })
})

app.get('/getcategory', (req, res) => {
    const categoryId = req.query.categoryId

    connection.query('SELECT categoryName FROM categories WHERE categoryId = ?', [categoryId], (error, rows, fields) => {
        if (!error) {
            res.send(rows)
        } else console.log(error)
    })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('Server is starting on port ' + port)
})