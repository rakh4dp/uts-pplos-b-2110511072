const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

// Routes Permintaan Darah
router.get('/requests', requestController.getAllRequests);
router.post('/requests', requestController.createRequest);
router.patch('/requests/:id/status', requestController.updateStatus);
router.delete('/requests/:id', requestController.deleteRequest);

// Routes Log 
router.get('/logs', requestController.getAllLogs);

// Routes Stok 
router.get('/stocks', requestController.getAllStocks);
router.post('/stocks/sync', requestController.receiveStockFromDonor);

// Routes Rumah Sakit 
router.get('/hospitals', requestController.getAllHospitals);
router.post('/hospitals', requestController.createHospital);
module.exports = router;