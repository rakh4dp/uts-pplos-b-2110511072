const Request = require('../models/Request');
const Stock = require('../models/Stock');
const Hospital = require('../models/Hospital');

const requestController = {
    getAllRequests: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10; 
            const offset = (page - 1) * limit;
            const status = req.query.status || null;

            const { total, data } = await Request.getAll(limit, offset, status);
            
            const total_pages = Math.ceil(total / limit);

            res.status(200).json({
                message: 'Data permintaan berhasil diambil',
                metadata: {
                    current_page: page,
                    per_page: limit,
                    total_data: total,   
                    total_pages: total_pages
                },data: data 
            });
        
        } catch (err) {
            res.status(500).json({ message: 'Terjadi kesalahan pada server', error: err.message });
        }
    },

    getAllHospitals: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 5; 
            const offset = (page - 1) * limit;

            const hospitals = await Hospital.getAll(limit, offset);
            res.status(200).json({
                message: 'Daftar Rumah Sakit berhasil diambil',
                data: hospitals
            });
        } catch (err) {
            res.status(500).json({ message: 'Error', error: err.message });
        }
    },

    getHospitalById: async (req, res) => {
        try {
            const hospital = await Hospital.findById(req.params.id);
            if (!hospital) {
                return res.status(404).json({ message: 'Rumah Sakit tidak ditemukan' });
            }
            res.status(200).json({ data: hospital });
        } catch (err) {
            res.status(500).json({ message: 'Error', error: err.message });
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
            const { id } = req.params;

            const currentData = await Request.getById(id);
            if (!currentData) {
                return res.status(404).json({ message: 'Permintaan tidak ditemukan' });
            }

            if (currentData.status === 'fulfilled') {
                return res.status(400).json({ 
                    success: false,
                    message: 'Permintaan tidak bisa dihapus karena status sudah "fulfilled" (darah sudah terkirim dan stok sudah terpotong).'
                });
            }

            await Request.delete(id);
            
            res.status(200).json({ 
                success: true,
                message: 'Permintaan berhasil dihapus.' 
            });
        } catch (err) {
            res.status(500).json({ message: 'Terjadi kesalahan pada server', error: err.message });
        }
    },

    getAllStocks: async (req, res) => {
        try {
            const stocks = await Stock.getAll();
            res.status(200).json({
                message: 'Data stok darah berhasil diambil',
                data: stocks
            });
        } catch (err) {
            res.status(500).json({ message: 'Error', error: err.message });
        }
    },
    
    getAllLogs: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const offset = (page - 1) * limit;

            const { total, data } = await Request.getAllLogs(limit, offset);
            const total_pages = Math.ceil(total / limit);

            res.status(200).json({
                message: 'Riwayat aktivitas berhasil diambil',
                metadata: {
                    current_page: page,
                    total_data: total,
                    total_pages: total_pages
                },
                data: data
            });
        } catch (err) {
            res.status(500).json({ message: 'Error', error: err.message });
        }
    },

    createHospital: async (req, res) => {
        try {
            const { name, address, phone } = req.body;
            if (!name || !address) return res.status(400).json({ message: 'Nama dan Alamat wajib diisi' });

            const result = await Hospital.create({ name, address, phone });
            res.status(201).json({ message: 'Rumah Sakit berhasil ditambahkan', id: result.insertId });
        } catch (err) {
            res.status(400).json({ message: 'Gagal menambah RS', error: err.message });
        }
    }
};

module.exports = requestController;