const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'db',
  user: 'root',
  password: 'password',
  database: 'cruddb',
  connectionLimit: 5
});

module.exports = pool;
