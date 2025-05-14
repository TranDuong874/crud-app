const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: fs.readFileSync('DigiCertGlobalRootCA.crt.pem'),
    rejectUnauthorized: false  // Disable certificate validation (NOT recommended for production)
  }
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to DB!");
});

module.exports = connection;
