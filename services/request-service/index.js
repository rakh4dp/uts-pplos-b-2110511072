const express = require('express');
const cors = require('cors'); // Tambahkan ini
const app = express();
const requestRoutes = require('./routes/requestRoutes');

app.use(cors()); 
app.use(express.json());

app.use('/api/v1', requestRoutes);

const PORT = 3003;
app.listen(PORT, () => {
    console.log(`request-service berjalan di http://localhost:${PORT}`);
});