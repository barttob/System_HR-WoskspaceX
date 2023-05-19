import passport from "passport";
import LocalStrategy from "passport-local";
// import { getUserByLogin } from "./connect.js";
import db from "./connect.js";
import bcrypt from "bcrypt";

passport.use(
  new LocalStrategy(function verify(username, password, cb) {
    db.get(
      "SELECT * FROM users WHERE username = ?",
      [username],
      function (err, user) {
        if (err) {
          return cb(err);
        }
        if (!user) {
          return cb(null, false, {
            message: "Incorrect username or password.",
          });
        }

        bcrypt.compare(password, user.hashed_password, function (err, isMatch) {
          if (err) {
            return cb(err);
          }
          if (!isMatch) {
            return cb(null, false, {
              message: "Incorrect username or password.",
            });
          }
          return cb(null, user);
        });
      }
    );
  })
);

// passport.use(
//   new LocalStrategy(async (login, password, done) => {
//     const user = await getUserByLogin(login);
//     if (!user) {
//       return done(null, false, { message: "Nieprawidłowy login lub hasło" });
//     }
//     if (user.password !== password) {
//       return done(null, false, { message: "Nieprawidłowy login lub hasło" });
//     }
//     return done(null, user);
//   })
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (user_id, done) => {
//   const user = await getUserById(user_id);
//   done(null, user);
// });

// export default function (app) {
//   app.use(passport.initialize());
//   app.use(passport.session());
// }
