const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Muhdhiqal2003',
  database: 'tauri_auth'
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ Connected to MySQL");
});

module.exports = db;
