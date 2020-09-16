const connection = {
    host: 'mysql-server',
    user: "root",
    password: "root",
    database: "bit_system",
    port: '3306',
    multipleStatements: true,
}

const builder = require('knex')({
    client: 'mysql',
    connection: connection,
})

export { connection, builder };