// middlewares/passportGoogleAuth.js
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Function to create a new GoogleStrategy with a dynamic callback URL
export const createGoogleStrategy = (callbackURL) => {
    return new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
        callbackURL,
    },
    (accessToken, refreshToken, profile, done) => {
        return done(null, { ...profile, accessToken });
    });
};

// Initialize passport with the strategy for the specific route
export const initializeGoogleStrategy = (callbackURL) => {
    passport.use('google', createGoogleStrategy(callbackURL));
};

// module.exports = {
//     initializeGoogleStrategy,
//     passport
// };

export default passport
