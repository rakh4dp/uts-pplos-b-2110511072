const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'db_auth'
});

db.connect((err) => {
    if (err) {
        console.error('Koneksi database gagal:', err.stack);
        return;
    }
    console.log('Auth Service terhubung ke Database');
});

module.exports = db;