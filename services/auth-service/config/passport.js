const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    proxy: true 
}, (accessToken, refreshToken, profile, done) => {
    const { id, displayName, emails, photos } = profile;
    const provider = 'google';
    const email = emails[0].value;
    const profilePic = photos[0].value;

    User.findByGoogleId(id, (err, results) => {
        if (err) return done(err);

        if (results.length > 0) {
            return done(null, results[0]);
        } else {
            const newUser = {
                provider: provider,
                provider_id: id,
                display_name: displayName,
                email: email,
                profile_pic: profilePic
            };
            User.create(newUser, (err, result) => {
                if (err) return done(err);
                return done(null, { id: result.insertId, ...newUser });
            });
        }
    });
}));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
    User.findById(id, (err, results) => done(err, results[0]));
});

module.exports = passport;