export default {
    development: {
        client: "mysql",
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