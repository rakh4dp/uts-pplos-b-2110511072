const db = require('../config/db');

const Request = {
    getAll: (limit, offset, status) => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM blood_requests';
            let params = [];

            if (status) {
                query += ' WHERE status = ?';
                params.push(status);
            }

            query += ' LIMIT ? OFFSET ?';
            params.push(limit, offset);

            db.query(query, params, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    },

    getById: (id) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM blood_requests WHERE id = ?', [id], (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });
    },

    create: (data) => {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO blood_requests 
                (hospital_id, user_id, blood_type_id, quantity_required, urgency) 
                VALUES (?, ?, ?, ?, ?)`;
            
            const params = [
                data.hospital_id, 
                data.user_id, 
                data.blood_type_id, 
                data.quantity_required, 
                data.urgency || 'normal'
            ];

            db.query(query, params, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    },

    updateStatus: (id, newStatus, oldStatus, notes) => {
        return new Promise((resolve, reject) => {
            db.beginTransaction((err) => {
                if (err) reject(err);

                const updateQuery = 'UPDATE blood_requests SET status = ? WHERE id = ?';
                db.query(updateQuery, [newStatus, id], (err) => {
                    if (err) return db.rollback(() => reject(err));

                    const logQuery = 'INSERT INTO request_logs (request_id, status_change, notes) VALUES (?, ?, ?)';
                    const statusChange = `${oldStatus} to ${newStatus}`;
                    
                    db.query(logQuery, [id, statusChange, notes], (err) => {
                        if (err) return db.rollback(() => reject(err));
                        
                        db.commit((err) => {
                            if (err) return db.rollback(() => reject(err));
                            resolve({ message: 'Success' });
                        });
                    });
                });
            });
        });
    },

    delete: (id) => {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM blood_requests WHERE id = ?';
            db.query(query, [id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }
};

module.exports = Request;