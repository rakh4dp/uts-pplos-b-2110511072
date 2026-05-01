const db = require('../config/db');

const Stock = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM blood_stocks', (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    },

    increment: (bloodTypeId, quantity) => {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE blood_stocks SET total_ml = total_ml + ? WHERE blood_type_id = ?';
            db.query(query, [quantity, bloodTypeId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    },

    decrement: (bloodTypeId, quantity) => {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE blood_stocks SET total_ml = total_ml - ? WHERE blood_type_id = ?';
            db.query(query, [quantity, bloodTypeId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    },

    checkStock: (bloodTypeId) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT total_ml FROM blood_stocks WHERE blood_type_id = ?', [bloodTypeId], (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });
    }
};

module.exports = Stock;