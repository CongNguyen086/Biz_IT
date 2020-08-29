const connection = {
    host: '127.0.0.1',
    user: "root",
    password: "sa123",
    database: "bit_system",
    port: '5000',
    multipleStatements: true
}

const builder = require('knex')({
    client: 'mysql',
    connection: connection,
})

exports.connection = connection
exports.builder = builder