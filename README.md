# Sistem Donor Darah 

> Sistem berbasis **Service-Oriented Architecture (SOA)** untuk manajemen donor darah, jadwal donor, stok darah, dan permintaan darah dari rumah sakit.

---

## Identitas 

| Field | Detail |
|---|---|
| **Nama** | Rakha Dwi Prayoga |
| **NIM** | 2410511072 |
| **Kelas** | B |
| **Mata Kuliah** | Pembangunan Perangkat Lunak Berorientasi Service |

---

## Demo Video

> 🔗 [Demo Video](https://youtu.be/vwEtQJixqS4?si=XAuKPYgsjiSFKc_J)

---

## Arsitektur Sistem

```
[Client / Postman]
       │
       ▼
[API Gateway] :3000 Node.js + Express
       ├──► [auth-service]    :3001  Node.js + Express  ──► [db_auth]    MySQL
       ├──► [donor-service]   :8000  PHP Laravel 11     ──► [db_donor]   MySQL
       └──► [request-service] :3003  Node.js + Express  ──► [db_request] MySQL
```

### Komunikasi Antar Service
- **Donor Service → Request Service**: Setiap kali ada riwayat donor dicatat, donor-service otomatis mengirim notifikasi ke request-service untuk menambah stok darah via `POST /stocks/sync`
- **Donor Service → Request Service**: Saat membuat jadwal donor, donor-service verifikasi rumah sakit ke request-service via `GET /hospitals/:id`

---

## Peta Routing Gateway

| Path di Gateway | Diteruskan ke | Service |
|---|---|---|
| `POST /auth/register` | `http://auth-service:3001/auth/register` | Auth Service |
| `POST /auth/login` | `http://auth-service:3001/auth/login` | Auth Service |
| `GET /auth/google` | `http://auth-service:3001/auth/google` | Auth Service |
| `GET /auth/callback` | `http://auth-service:3001/auth/callback` | Auth Service |
| `POST /auth/refresh-token` | `http://auth-service:3001/auth/refresh-token` | Auth Service |
| `POST /auth/logout` | `http://auth-service:3001/auth/logout` | Auth Service |
| `GET /auth/me` | `http://auth-service:3001/auth/me` | Auth Service |
| `GET /api/blood-types` | `http://donor-service:80/api/v1/blood-types` | Donor Service |
| `GET /api/schedules` | `http://donor-service:80/api/v1/schedules` | Donor Service |
| `* /api/donors/**` | `http://donor-service:80/api/v1/donors/**` | Donor Service |
| `* /requests/**` | `http://request-service:3003/api/v1/**` | Request Service |


---

## Stack Teknologi

| Komponen | Teknologi |
|---|---|
| API Gateway | Node.js, Express, http-proxy-middleware, express-rate-limit |
| Auth Service | Node.js, Express, Passport.js, JWT, bcryptjs, Google OAuth 2.0 |
| Donor Service | PHP 8.2, Laravel 11, MySQL |
| Request Service | Node.js, Express, MySQL2 |
| Database | MySQL (XAMPP untuk development, Docker MySQL untuk production) |
| Containerization | Docker, Docker Compose |
| Auth | JWT (Access Token 15 menit, Refresh Token 7 hari) |
| OAuth | Google OAuth 2.0 (Authorization Code Flow) |

---

## Struktur Folder

```
uts-pplos-b-2410511072/
├── README.md
├── docker-compose.yml
├── mysql-init/
├── gateway/
├── services/
│   ├── auth-service/
│   ├── donor-service/        
│   └── request-service/
├── docs/
│   ├── laporan-uts.pdf
│   └── arsitektur.png
├── postman/
│   └── collection.json
```

---

## Cara Menjalankan

### Prasyarat
- Docker & Docker Compose
- Git

### Langkah-langkah

**1. Clone repository**
```bash
git clone https://github.com/rakh4dp/uts-pplos-b-2110511072.git
cd uts-pplos-b-2110511072
```

**2. Buat file `.env` untuk setiap service**
Salin dari masing-masing `.env.example` yang tersedia:
```bash
cp gateway/.env.example gateway/.env
cp services/auth-service/.env.example services/auth-service/.env
cp services/donor-service/.env.example services/donor-service/.env
cp services/request-service/.env.example services/request-service/.env
```
Lalu isi nilai yang sesuai di masing-masing file `.env`.

**3. Jalankan semua service dengan Docker Compose**
```bash
docker-compose up --build
```
Tunggu hingga semua service muncul pesan bahwa service sudah berjalan.

**4. Isi data awal (Seeding) — Jalankan setelah docker-compose up berhasil**

Isi data golongan darah di Donor Service (Laravel):
```bash
docker-compose exec donor-service php artisan db:seed
```

Isi data rumah sakit dan stok darah awal di Request Service (Node.js):
```bash
docker-compose exec request-service node seed.js
```

**5. Akses aplikasi**
- API Gateway: `http://localhost:3000`
- phpMyAdmin: `http://localhost:8081`

**6. Import Postman Collection**
- Buka Postman
- Import file `postman/collection.json`
- Set variable `base_url` = `http://localhost:3000`

## Daftar Endpoint API

> **Base URL**: `http://localhost:3000`

---

### Auth Service (`/auth`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| POST | `/auth/register` | No | Registrasi user baru |
| POST | `/auth/login` | No | Login dengan email & password |
| GET | `/auth/google` | No | Login dengan Google OAuth |
| GET | `/auth/callback` | No | Callback Google OAuth |
| POST | `/auth/refresh-token` | No | Refresh access token |
| POST | `/auth/logout` | Yes | Logout & invalidate token |
| GET | `/auth/me` | Yes | Lihat profil user yang login |

---

### Donor Service (`/api`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/api/blood-types` | Yes | Lihat semua golongan darah |
| GET | `/api/schedules` | Yes | Lihat semua jadwal donor |
| GET | `/api/donors` | Yes | Lihat semua pendonor |
| POST | `/api/donors` | Yes | Daftar sebagai pendonor |
| GET | `/api/donors/:id` | Yes | Lihat detail pendonor |
| PUT | `/api/donors/:id` | Yes | Update data pendonor |
| DELETE | `/api/donors/:id` | Yes | Hapus pendonor |
| GET | `/api/donors/:id/schedules` | Yes | Lihat jadwal donor tertentu |
| POST | `/api/donors/:id/schedules` | Yes | Buat jadwal donor |
| GET | `/api/donors/:id/schedules/:sid` | Yes | Lihat detail jadwal |
| PUT | `/api/donors/:id/schedules/:sid` | Yes | Update jadwal |
| DELETE | `/api/donors/:id/schedules/:sid` | Yes | Hapus jadwal |
| GET | `/api/donors/:id/histories` | Yes | Lihat riwayat donor |
| POST | `/api/donors/:id/histories` | Yes | Catat riwayat donor |
| GET | `/api/donors/:id/histories/:hid` | Yes | Lihat detail riwayat |
| PUT | `/api/donors/:id/histories/:hid` | Yes | Update riwayat |
| DELETE | `/api/donors/:id/histories/:hid` | Yes | Hapus riwayat |

---

### Request Service (`/requests`)

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| GET | `/requests/hospitals` | Yes | Lihat semua rumah sakit |
| POST | `/requests/hospitals` | Yes | Daftarkan rumah sakit baru |
| GET | `/requests/hospitals/:id` | Yes | Lihat detail rumah sakit |
| GET | `/requests` | Yes | Lihat semua permintaan darah |
| POST | `/requests` | Yes | Buat permintaan darah |
| PATCH | `/requests/:id/status` | Yes | Update status permintaan |
| DELETE | `/requests/:id` | Yes | Hapus permintaan |
| GET | `/requests/stocks` | Yes | Lihat stok darah |
| POST | `/requests/stocks/sync` | Yes | Sinkronisasi stok dari donor |
| GET | `/requests/logs` | Yes | Lihat log perubahan status |

---
---

## Contoh Request Body

### Register
```json
POST /auth/register
{
    "name": "Rakha",
    "email": "rakha@gmail.com",
    "password": "password123"
}
```

### Login
```json
POST /auth/login
{
    "email": "rakha@gmail.com",
    "password": "password123"
}
```

### Daftar Pendonor
```json
POST /api/donors
{
    "name": "Rakha",
    "phone": "081234567890",
    "address": "Jl. Contoh No. 1 Jakarta",
    "blood_type_id": 1
}
```

### Buat Jadwal Donor
```json
POST /api/donors/1/schedules
{
    "schedule_date": "2026-05-10",
    "hospital_id": 1
}
```

### Catat Riwayat Donor
```json
POST /api/donors/1/histories
{
    "schedule_id": 1,
    "donation_date": "2026-05-01",
    "quantity_ml": 350,
    "notes": "ok"
}
```

### Buat Permintaan Darah
```json
POST /requests
{
    "hospital_id": 1,
    "blood_type_id": 1,
    "quantity_required": 500,
    "urgency": "normal"
}
```

### Update Status Permintaan
```json
PATCH /requests/1/status
{
    "status": "fulfilled",
    "notes": "Darah sudah dikirim ke RS"
}
```

---

## Skema Database

### db_auth
- `users` — Data user (local & Google OAuth)
- `refresh_tokens` — Penyimpanan refresh token untuk blacklist saat logout

### db_donor
- `blood_types` — Master data golongan darah (A+, A-, B+, B-, AB+, AB-, O+, O-)
- `donors` — Data pendonor
- `donation_schedules` — Jadwal donor
- `donation_history` — Riwayat donor

### db_request
- `hospitals` — Data rumah sakit
- `blood_stocks` — Stok darah per golongan
- `blood_requests` — Permintaan darah dari rumah sakit
- `request_logs` — Log perubahan status permintaan

---

