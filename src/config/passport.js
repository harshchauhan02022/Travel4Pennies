// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../components/models/user.Model');

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL 
  },
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ where: { googleId: profile.id } });
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value
        });
      }
      return done(null, user);
    } catch (e) {
      return done(e);
    }
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try { done(null, await User.findByPk(id)); }
  catch (e) { done(e); }
});

module.exports = passport;
