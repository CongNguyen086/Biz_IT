import express from 'express';
import mysql from 'mysql';
import { createServer } from 'http';
import bodyParser from 'body-parser';
import multer from 'multer';
import cors from 'cors';
import { Expo } from 'expo-server-sdk';

import rootRouter from "./routes";
import GeoCalculate from './models/GeoCalculate';
import Store from './models/Store';
import Category from './models/Category';

import MysqlClient from './config/db';
import { SocketServer } from './modules/socket';
import config from './knexfile';

let expo = new Expo();

// mysql://bb0fa2c19d3675:8fbf3bba@us-cdbr-iron-east-05.cleardb.net/heroku_35c3d24bcc95fd7?reconnect=true
const app = express();

app.use(cors())
app.use(bodyParser.json());
// app.use(express.static('upload'));
app.use(express.static(__dirname + '/uploads'));

// Init database instance
const mysqlInstance = MysqlClient.getInstance();
mysqlInstance.connectDb();

const connection = mysql.createConnection(config[process.env.NODE_ENV || 'development'].connection);
connection.connect((error) => {
    if (!error) {
        // console.log('Connect database succeeded')
    } else
        console.log('Connect database failed', error)
});

app.use(rootRouter);
const httpServer = createServer(app);
const socketServer = new SocketServer(httpServer);
socketServer.init();

// UserId: 8159657106479438377
app.get('/getpopulardeal', (req, res) => {
    connection.query('CALL GetPopularDeal()', (error, rows, fields) => {
        if (!error) {
            res.send(rows)
        } else console.log(error);
    })
})

app.get('/', (req, res) => {
    res.json({ "connected": 'connected' }).status(200)
})

// app.get('/getrecommendeddeal', (req, res) => {
//     const userId = req.query.userId
//     connection.query('CALL GetRecommendedDeal(?)', [userId], (error, rows, fields) => {
//         if (!error) {
//             res.send(rows)
//         } else console.log(error);
//     })
// })

//2 6683159578094575932 
app.get('/getstorepromotion', (req, res) => {
    const dealId = req.query.dealId
    connection.query('CALL GetStorePromotion(?)', [dealId], (error, rows, fields) => {
        if (!error) {
            var string = JSON.stringify(rows);
            var jsonRows = JSON.parse(string);
            // console.log(dealId)
            res.send(jsonRows[0])
        } else console.log(error);
    })
})

// app.get('/gettimerecommendationdeal', (req, res) => {
//     const userId = req.query.userId
//     const current_time = req.query.currentTime
//     let today = new Date();
//     // let current_time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
//     // let current_time = '12:00:00';
//     connection.query('CALL GetTimeRecommendationDeal(?, ?)', [userId, current_time], (error, rows, fields) => {
//         if (!error) {
//             res.send(rows)
//             // console.log(current_time)
//         } else console.log(error);
//     })
// })

app.get('/login', (req, res) => {
    const phone = req.query.phone
    const password = req.query.password

    connection.query('SELECT * FROM users Where (userPhone = ? AND userPassword = ?)', [phone, password], (error, rows, fields) => {
        if (!error) {
            res.send(rows)
        } else console.log(error);
    })
})

app.get('/getuserinfobyid', (req, res) => {
    const userId = req.query.userId

    connection.query('SELECT * FROM users WHERE userId = ?', [userId], (error, rows, fields) => {
        if (!error) {
            res.send(rows)
        } else console.log(error)
    })
})

// app.put('/putusercash', (req, res) => {
//     const cash = req.query.cash
//     const userId = req.query.userId

//     connection.query('UPDATE users SET userCash = ? WHERE userId = ?', [cash, userId], (error, rows, fields) => {
//         if (!error) {
//             res.send(rows)
//         } else console.log(error);
//     })
// })

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
        console.log("🚀 ~ file: main.js ~ line 182 ~ connection.query ~ rows", rows)
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

app.post('/getMiddlePoint', (req, res) => {
    const data = {
        locationList: req.body.locationList
    }
    const middleCoords = GeoCalculate.getCenterPoint(data.locationList)
    if (middleCoords !== 'undefined') {
        res.send(middleCoords)
    }
})

app.post('/getStoresInRange/', async (req, res) => {
    const data = {
        middleLat: req.body.middleLat,
        middleLng: req.body.middleLng,
        radius: req.body.radius,
    }
    let storeList = await Store.getStoresInRange(data.middleLat, data.middleLng, data.radius)

    if (storeList != null) {
        res.send(storeList)
    }
})

app.get('/getAllCategories', async (req, res) => {
    const list = await Category.getAllCategory()
    if (list != null) {
        res.send(list)
    }
})

app.get('/getstoreaddress', (req, res) => {
    const storeId = req.query.storeId

    connection.query('SELECT storeAddress FROM stores WHERE storeId = ?', [storeId], (error, rows, fields) => {
        if (!error) {
            res.send(rows)
        } else console.log(error)
    })
})

// app.put('/putusercode', (req, res) => {
//     const userId = req.query.userId
//     const storeId = req.query.storeId
//     const userTimestamps = new Date().getTime()
//     const userCode = req.query.userCode

//     connection.query('UPDATE users SET userTimestamps = ?, userCode = ?, userStoreId = ?  WHERE userId = ?;', [userTimestamps, userCode, storeId, userId], (error, rows, fields) => {
//         if (!error) {
//             res.send(rows)
//         } else console.log(error)
//     })
// })

// app.get('/getuserinfobycode', (req, res) => {
//     const userCode = req.query.userCode

//     connection.query('SELECT * FROM users WHERE userCode = ?', [userCode], (error, rows, fields) => {
//         if (!error) {
//             res.send(rows)
//         } else console.log(error)
//     })
// })

// app.put('/putuserscore', (req, res) => {
//     const userId = req.query.userId
//     const storeId = req.query.storeId
//     const userTimestamps = new Date().getTime()
//     const userCode = req.query.userCode

//     connection.query('UPDATE users SET userTimestamps = ?, userCode = ?, userStoreId = ?  WHERE userId = ?;', [userTimestamps, userCode, storeId, userId], (error, rows, fields) => {
//         if (!error) {
//             res.send(rows)
//         } else console.log(error)
//     })
// })

// app.put('/applyscore', (req, res) => {
//     const userId = req.query.userId
//     const userScore = req.query.userScore
//     const userScoreTotal = req.query.userScoreTotal

//     connection.query('UPDATE users SET userScore = ?, userScoreTotal = ?  WHERE userId = ?;', [userScore, userScoreTotal, userId], (error, rows, fields) => {
//         if (!error) {
//             res.send({ status: 'done' })
//         } else console.log(error)
//     })
// })

app.post('/postcheckcode', (req, res) => {
    const userId = req.query.userId
    const userCode = req.query.userCode

    connection.query('INSERT INTO check_code (userId, applyCode) VALUES (?, ?);', [userId, userCode], (error, rows, fields) => {
        if (!error) {
            res.send(rows)
        } else console.log(error)
    })
})

app.get('/getcheckcode', (req, res) => {
    const userId = req.query.userId

    connection.query('SELECT * FROM check_code WHERE userId = ?;', [userId], (error, rows, fields) => {
        if (!error) {
            res.send(rows)
        } else console.log(error)
    })
})

app.put('/postusertoken', (req, res) => {
    const userId = req.query.userId
    const userToken = req.query.userToken

    connection.query('UPDATE users SET userToken = ? WHERE userId = ?;', [userToken, userId], (error, rows, fields) => {
        if (!error) {
            res.send(rows)
        } else console.log(error)
    })
})

app.post('/pushnotification', (req, res) => {
    const userId = req.query.userId
    connection.query('SELECT userToken, fullName FROM users WHERE userId = ?;', [userId], (error, rows, fields) => {
        if (!error) {
            let messages = [];
            let somePushTokens = [rows[0].userToken]
            for (let pushToken of somePushTokens) {
                if (!Expo.isExpoPushToken(pushToken)) {
                    console.log(Expo.isExpoPushToken(pushToken))
                    console.error(`Push token ${pushToken} is not a valid Expo push token`);
                    continue;
                }
                messages.push({
                    to: pushToken,
                    sound: 'default',
                    title: req.query.title,
                    body: rows[0].fullName + ' ' + req.query.body,
                    data: {
                        name: req.body.name,
                        class: req.body.class
                    },
                })
            }
            let chunks = expo.chunkPushNotifications(messages);
            let tickets = [];
            (async () => {
                for (let chunk of chunks) {
                    try {
                        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                        console.log(ticketChunk);
                        tickets.push(...ticketChunk);
                    } catch (error) {
                        console.error(error);
                    }
                }
            })();

            let receiptIds = [];
            for (let ticket of tickets) {
                if (ticket.id) {
                    receiptIds.push(ticket.id);
                }
            }

            let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
            (async () => {
                for (let chunk of receiptIdChunks) {
                    try {
                        let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
                        console.log(receipts);

                        for (let receipt of receipts) {
                            if (receipt.status === 'ok') {
                                continue;
                            } else if (receipt.status === 'error') {
                                console.error(`There was an error sending a notification: ${receipt.message}`);
                                if (receipt.details && receipt.details.error) {
                                    console.error(`The error code is ${receipt.details.error}`);
                                }
                            }
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            })();
        } else console.log(error)
    })
})

// app.put('/redeemreward', (req, res) => {
//     const userId = req.query.userId
//     const userScore = req.query.userScore
//     const userReward = req.query.userReward

//     connection.query('UPDATE users SET userScore = ?, userReward = ?  WHERE userId = ?;', [userScore, userReward, userId], (error, rows, fields) => {
//         if (!error) {
//             res.send(rows)
//         } else console.log(error)
//     })
// })

app.get('/getmerchantimage', (req, res) => {
    const serviceId = req.query.serviceId

    connection.query('SELECT * FROM merchants WHERE serviceId = ?;', [serviceId], (error, rows, fields) => {
        if (!error) {
            res.send(rows)
        } else console.log(error)
    })
})

const port = process.env.PORT || 3000

httpServer.listen(port, () => {
    console.log('Server is starting on port ' + port)
})