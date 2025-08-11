const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../components/models/user.Model');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const [user] = await User.findOrCreate({
                where: { email: profile.emails[0].value },
                defaults: {
                    full_name: profile.displayName,
                    email: profile.emails[0].value,
                    provider: profile.provider,
                    googleId: profile.id
                }
            });
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    }));
