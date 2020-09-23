export default {
    development: {
        client: "mysql2",
        connection: {
            host: 'mysql-server',
            user: "root",
            password: "root",
            database: "bit_system",
            port: '3306',
            multipleStatements: true,
        }
    }
}