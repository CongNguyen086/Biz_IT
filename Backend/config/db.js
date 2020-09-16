import Knex from 'knex';
import config from '../knexfile';

export default class MysqlClient {
    static _instance;
    _connection = null;
    constructor() { }


    static getInstance() {
        if (!MysqlClient._instance) {
            MysqlClient._instance = new MysqlClient();
        }

        return MysqlClient._instance;
    }

    get connection() {
        return this._connection;
    }
    set connection(value) {
        this._connection = value;
    }

    connectDb() {
        const connection = config[process.env.NODE_ENV || 'development'];
        this._connection = new Knex(connection);
        console.log('Connect database succeeded');
    }
}