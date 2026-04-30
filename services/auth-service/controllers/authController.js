const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken'); 

const authController = {
    // REGISTER 
    register: async (req, res) => {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(422).json({ message: 'Semua kolom wajib diisi' });
        }

        try {
            User.findByEmail(email, async (err, results) => {
                if (results.length > 0) {
                    return res.status(409).json({ message: 'Email sudah digunakan' });
                }

                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                const newUser = {
                    provider: 'local',
                    display_name: name,
                    email: email,
                    password: hashedPassword
                };

                User.create(newUser, (err, result) => {
                    if (err) return res.status(500).json({ message: 'Gagal mendaftarkan user' });
                    res.status(201).json({ message: 'Registrasi berhasil, silakan login' });
                });
            });
        } catch (error) {
            res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
    },

    // LOGIN  
    login: (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(422).json({ message: 'Email dan password wajib diisi' });
        }

        User.findByEmail(email, async (err, results) => {
            if (err) return res.status(500).json({ message: 'Terjadi kesalahan server' });

            if (results.length === 0) {
                return res.status(401).json({ message: 'Email atau password salah' });
            }

            const user = results[0];
            if (!user.password) {
                return res.status(400).json({ message: 'Akun ini terdaftar via Google. Silakan login dengan Google.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Email atau password salah' });
            }

            const payload = { id: user.id, name: user.display_name, email: user.email };
            const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
            const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

            RefreshToken.create(user.id, refreshToken, (err) => {
                if (err) return res.status(500).json({ message: 'Gagal menyimpan session login' });
                
                res.status(200).json({
                    message: 'Login berhasil',
                    accessToken,
                    refreshToken
                });
            });
        });
    },

    // GOOGLE OAUTH CALLBACK 
    googleCallback: (req, res) => {
        const user = req.user;
        const payload = { id: user.id, name: user.display_name, email: user.email };
        
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        RefreshToken.create(user.id, refreshToken, (err) => {
            if (err) return res.status(500).json({ message: 'Gagal sinkronisasi OAuth' });
            
             res.send(`
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 500px; margin: 50px auto; text-align: center;">
                    <h1 style="color: #4285F4;">Login Google Berhasil!</h1>
                    <img src="${user.profile_pic}" width="100" style="border-radius: 50%; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                    <h2>Hello, ${user.display_name}!</h2>
                    <p style="color: #666;">Email: ${user.email}</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    
                    <h3 style="text-align: left;">Access Token (JWT):</h3>
                    <textarea rows="4" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc; background: #f9f9f9;" readonly>${accessToken}</textarea>
                    
                    <p style="font-size: 12px; color: #999; margin-top: 10px; text-align: left;">
                        *Gunakan token di atas untuk header Authorization di Postman
                    </p>

                    <form action="/auth/logout" method="POST" style="margin-top: 20px;">
                        <input type="hidden" name="token" value="${refreshToken}">
                        <button type="submit" style="background:#d93025; color:white; border:none; padding: 10px 20px; border-radius: 5px; cursor: pointer; width: 100%; font-weight: bold;">
                            LOGOUT DARI SISTEM
                        </button>
                    </form>
                </div>
            `);
        });
    },

    // REFRESH TOKEN 
    refreshToken: (req, res) => {
        const { token } = req.body; 

        if (!token) return res.status(401).json({ message: 'Refresh Token dibutuhkan' });

        RefreshToken.findByToken(token, (err, results) => {
            if (err || results.length === 0) {
                return res.status(403).json({ message: 'Refresh Token tidak valid atau sudah logout' });
            }

            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) return res.status(403).json({ message: 'Refresh Token expired' });

                const newAccessToken = jwt.sign(
                    { id: decoded.id, name: decoded.name, email: decoded.email }, 
                    process.env.JWT_SECRET, 
                    { expiresIn: '15m' }
                );

                res.status(200).json({ accessToken: newAccessToken });
            });
        });
    },

    // LOGOUT / BLACKLIST 
    logout: (req, res) => {
        const { token } = req.body; 

        if (!token) {
            return res.status(400).json({ message: 'Token dibutuhkan untuk logout' });
        }

        RefreshToken.delete(token, (err) => {
            if (err) return res.status(500).json({ message: 'Gagal memproses logout' });

            req.logout((err) => {
                if (err) return res.status(500).json({ message: 'Gagal menghapus sesi' });
                
                res.status(200).json({ 
                    message: 'Logout berhasil. Token telah di-invalidate.' 
                });
            });
        });
    }
};

module.exports = authController;