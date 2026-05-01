const db = require('./config/db');

const seedHospitals = () => {
    return new Promise((resolve, reject) => {
        const hospitals = [
            ['RS Fatmawati', 'Jl. RS. Fatmawati Raya No.4, Cilandak, Jakarta Selatan', '0217660552'],
            ['RS Pondok Indah', 'Jl. Metro Pondok Indah Kav. IV/2, Jakarta Selatan', '0217657525'],
            ['RS Siloam Semanggi', 'Jl. Garnisun Dalam No.2-3, Jakarta Selatan', '02129959000'],
            ['RSUPN Dr. Cipto Mangunkusumo (RSCM)', 'Jl. Diponegoro No.71, Senen, Jakarta Pusat', '0211500135'],
            ['RS Gatot Soebroto', 'Jl. Dr. Abdul Rahman Saleh No.24, Jakarta Pusat', '0213441008'],
            ['RS Medistra', 'Jl. Jend. Gatot Subroto Kav. 59, Jakarta Selatan', '0215210200'],
            ['RS Tarakan', 'Jl. Kyai Caringin No.7, Gambir, Jakarta Pusat', '0213503003'],
            ['RS Premier Bintaro', 'Jl. MH. Thamrin Blok B3 No.1, Tangerang Selatan', '02127625500'],
            ['RS Pelni', 'Jl. Ks. Tubun No.92 - 94, Palmerah, Jakarta Barat', '0215306901'],
            ['RS Pantai Indah Kapuk', 'Jl. Pantai Indah Utara 3, Penjaringan, Jakarta Utara', '0215880911']
        ];
        
        const query = 'INSERT IGNORE INTO hospitals (name, address, phone) VALUES ?';
        db.query(query, [hospitals], (err) => {
            if (err) reject(err);
            else {
                console.log('Data hospitals berhasil disinkronkan!');
                resolve();
            }
        });
    });
};

const seedBloodStocks = () => {
    return new Promise((resolve, reject) => {
        const stocks = [
            [1, 5000], [2, 3500], [3, 4000], [4, 2000],
            [5, 1500], [6, 1000], [7, 6000], [8, 4500]
        ];
        
        const query = 'INSERT IGNORE INTO blood_stocks (blood_type_id, total_ml) VALUES ?';
        db.query(query, [stocks], (err) => {
            if (err) reject(err);
            else {
                console.log('Data blood_stocks berhasil diinisialisasi!');
                resolve();
            }
        });
    });
};

const seedBloodRequests = () => {
    return new Promise((resolve, reject) => {
        const requests = [
            [1, 10, 1, 2, 'open', 'urgent'],
            [2, 11, 7, 5, 'in-progress', 'normal'],
            [3, 12, 3, 3, 'fulfilled', 'normal'],
            [1, 10, 5, 1, 'open', 'normal']
        ];
        const query = 'INSERT IGNORE INTO blood_requests (hospital_id, user_id, blood_type_id, quantity_required, status, urgency) VALUES ?';
        db.query(query, [requests], (err) => {
            if (err) reject(err);
            else {
                console.log('Data blood_requests berhasil ditambahkan!');
                resolve();
            }
        });
    });
};

async function runSeeder() {
    try {
        console.log('Memulai seeding ke db_request...');
        await seedHospitals();
        await seedBloodStocks();
        await seedBloodRequests();
        console.log('proses seeding selesai');
    } catch (err) {
        console.error('Terjadi kesalahan saat seeding:', err);
    } finally {
        db.end();
        process.exit();
    }
}

runSeeder();