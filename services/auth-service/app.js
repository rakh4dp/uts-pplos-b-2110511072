require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Auth Service is Up and Running!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
    console.log(`Database connected`);
});