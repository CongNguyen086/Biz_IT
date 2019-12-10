const builder = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: "root",
        password: "sa123",
        database: "bit_system",
        port: '3306',
        multipleStatements: true
    },
})

exports.builder = builder