const db = require('../config/db');

const RefreshToken = {
    create: (userId, token, callback) => {
        db.query('INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)', [userId, token], callback);
    },
    findByToken: (token, callback) => {
        db.query('SELECT * FROM refresh_tokens WHERE token = ?', [token], callback);
    },
    delete: (token, callback) => {
        db.query('DELETE FROM refresh_tokens WHERE token = ?', [token], callback);
    }
};

module.exports = RefreshToken;