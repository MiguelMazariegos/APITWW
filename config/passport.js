const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

// Exporta el modulo para crear el passport con google-oauth20
module.exports = function(passport) {
    // Se crea un passport con una nueva GoogleStrategy
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
      },
      // Se comprueba si el usuario esta registrado en la base de datos local
      // si no es asi, se crea un documento con los datos del nuevo usuario
      async (accessToken, refreshToken, profile, done) => {
          const newUser = {
              googleId: profile.id,
              displayName: profile.displayName,
              nombre: profile.name.givenName,
              apellido: profile.name.familyName,
              imagen: profile.photos[0].value
          }
          try {
              let user = await User.findOne({ googleId: profile.id });

              if(user) {
                  done(null, user)
              } else {
                  user = await User.create(newUser);
                  done(null, user);
              }
          } catch(err) {
              console.error(err);
          }
      }));

      // Middleware para utilizar el passport
      passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
      });
    
}