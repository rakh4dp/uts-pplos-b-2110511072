const db = require('../config/db');

const User = {
    findById: (id, callback) => {
        db.query('SELECT * FROM users WHERE id = ?', [id], callback);
    },

    findByGoogleId: (googleId, callback) => {
        db.query('SELECT * FROM users WHERE provider_id = ?', [googleId], callback);
    },

    findByEmail: (email, callback) => {
        db.query('SELECT * FROM users WHERE email = ?', [email], callback);
    },

    create: (userData, callback) => {
        db.query('INSERT INTO users SET ?', userData, callback);
    }
};

module.exports = User;