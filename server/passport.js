import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import connectToDatabase from './connect.js';

const connection = await connectToDatabase();

//Konfiguracja strategii uwierzytelniania
passport.use(new LocalStrategy(
    {
      usernameField: 'login',
      passwordField: 'password'
    },
    (login, password, done) => {
        //Pobierz użytkownika z bazy danych na podstawie nazwy użytkownika
      connection.query('SELECT * FROM users WHERE login = ?', [login], (error, results) => {
        if (error) {
          return done(error);
        }
        if (results.length === 0) {
          return done(null, false, { message: 'Nieprawidłowy login lub hasło.' });
        }
        //Zweryfikuj hasło użytkownika przy użyciu modułu bcrypt
        bcrypt.compare(password, results[0].password, (error, isValid) => {
          if (error) {
            return done(error);
          }
          if (!isValid) {
            return done(null, false, { message: 'Nieprawidłowy login lub hasło.' });
          }
          return done(null, results[0]);
        });
      });
    }
));

//Serializacja i deserializacja użytkownika
passport.serializeUser((user, done) => {
    done(null, user.id);
});
  
passport.deserializeUser((login, done) => {
    connection.query('SELECT * FROM users WHERE login = ?', [login], (error, results) => {
      if (error) {
        return done(error);
      }
      return done(null, results[0]);
    });
});

//module.exports = passport;
//export const passport = passport;
export default passport;