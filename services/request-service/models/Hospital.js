const db = require('../config/db');

const Hospital = {
    getAll: (limit, offset) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM hospitals LIMIT ? OFFSET ?';
            db.query(query, [limit, offset], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    },

    findById: (id) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM hospitals WHERE id = ?', [id], (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });
    }
};

module.exports = Hospital;