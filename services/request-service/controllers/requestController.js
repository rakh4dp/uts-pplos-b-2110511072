const Request = require('../models/Request');
const Stock = require('../models/Stock');
const Hospital = require('../models/Hospital');

const requestController = {
    getAllRequests: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const offset = (page - 1) * limit;
            const status = req.query.status || null;

            const requests = await Request.getAll(limit, offset, status);
            
            res.status(200).json({
                message: 'Data permintaan berhasil diambil',
                page,
                data: requests
            });
        } catch (err) {
            res.status(500).json({ message: 'Terjadi kesalahan pada server', error: err.message });
        }
    },

    createRequest: async (req, res) => {
        try {
            const { hospital_id, blood_type_id, quantity_required, urgency } = req.body;
            const user_id = req.headers['x-user-id'] || 1; 

            const hospital = await Hospital.findById(hospital_id);
            if (!hospital) {
                return res.status(404).json({ message: 'Rumah Sakit tidak terdaftar' });
            }

            const newRequest = await Request.create({
                hospital_id, user_id, blood_type_id, quantity_required, urgency
            });

            res.status(201).json({ message: 'Permintaan darah berhasil dibuat', id: newRequest.insertId });
        } catch (err) {
            res.status(400).json({ message: 'Gagal membuat permintaan', error: err.message });
        }
    },

    updateStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status, notes } = req.body;

            const currentData = await Request.getById(id);
            if (!currentData) return res.status(404).json({ message: 'Permintaan tidak ditemukan' });

            if (status === 'fulfilled' && currentData.status !== 'fulfilled') {
                const stock = await Stock.checkStock(currentData.blood_type_id);
                if (!stock || stock.total_ml < currentData.quantity_required) {
                    return res.status(400).json({ message: 'Stok darah tidak mencukupi' });
                }
                await Stock.decrement(currentData.blood_type_id, currentData.quantity_required);
            }

            await Request.updateStatus(id, status, currentData.status, notes);
            
            res.status(200).json({ message: 'Status dan stok berhasil diperbarui' });
        } catch (err) {
            res.status(500).json({ message: 'Error', error: err.message });
        }
    },

    receiveStockFromDonor: async (req, res) => {
        try {
            const { blood_type_id, quantity_ml } = req.body;
            await Stock.increment(blood_type_id, quantity_ml);
            res.status(200).json({ message: 'Stok berhasil bertambah' });
        } catch (err) {
            res.status(500).json({ message: 'Error', error: err.message });
        }
    },

    deleteRequest: async (req, res) => {
        try {
            await Request.delete(req.params.id);
            res.status(204).send(); 
        } catch (err) {
            res.status(404).json({ message: 'Data tidak ditemukan' });
        }
    }
};

module.exports = requestController;