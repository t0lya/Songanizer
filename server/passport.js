const passport = require('passport')
const passportJWT = require('passport-jwt')
require('dotenv').config({ path: '../.env' })

const User = require('./db/user')
const YOUR_JWT_SECRET = process.env.REACT_APP_YOUR_JWT_SECRET

passport.use(new passportJWT.Strategy({
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: YOUR_JWT_SECRET
}, async(payload, done) => {
    try {
        // Find the user specified in the token
        const user = await User.findOne({googleId: payload.googleId})
        if (!user) return done(null, false)
        // If user exists, return the user
        return done(null, user)
    } catch(error) {
        done(error, false)
    }
}))
    
    