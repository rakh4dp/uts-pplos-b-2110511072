const db = require('../config/db');

const Request = {
    getAll: (limit, offset, status) => {
        return new Promise((resolve, reject) => {
            let queryData = 'SELECT * FROM blood_requests';
            let queryCount = 'SELECT COUNT(*) as total FROM blood_requests';
            let params = [];

            if (status) {
                queryData += ' WHERE status = ?';
                queryCount += ' WHERE status = ?';
                params.push(status);
            }

            queryData += ' LIMIT ? OFFSET ?';
            const paramsData = [...params, limit, offset];

            db.query(queryCount, params, (err, countResult) => {
                if (err) return reject(err);
                
                db.query(queryData, paramsData, (err, dataResults) => {
                    if (err) return reject(err);
                    
                    resolve({
                        total: countResult[0].total,
                        data: dataResults
                    });
                });
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
        const updateQuery = 'UPDATE blood_requests SET status = ? WHERE id = ?';
        db.query(updateQuery, [newStatus, id], (err) => {
            if (err) return reject(err);

            const logQuery = 'INSERT INTO request_logs (request_id, status_change, notes) VALUES (?, ?, ?)';
            const statusChange = `${oldStatus} to ${newStatus}`;
            
            db.query(logQuery, [id, statusChange, notes || null], (err) => {
                if (err) {
                    return reject(err);
                }
                
                resolve({ message: 'Success' });
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
    },

    getAllLogs: (limit, offset) => {
        return new Promise((resolve, reject) => {
            const queryCount = 'SELECT COUNT(*) as total FROM request_logs';
            const queryData = 'SELECT * FROM request_logs ORDER BY created_at DESC LIMIT ? OFFSET ?';

            db.query(queryCount, (err, countResult) => {
                if (err) return reject(err);
                db.query(queryData, [limit, offset], (err, dataResults) => {
                    if (err) return reject(err);
                    resolve({
                        total: countResult[0].total,
                        data: dataResults
                    });
                });
            });
        });
    }
};

module.exports = Request;