import passport from "passport";
import LocalStrategy from "passport-local";
import { getUserByLogin } from "./connect.js";

passport.use(
  new LocalStrategy(async (login, password, done) => {
    const user = await getUserByLogin(login);
    if (!user) {
      return done(null, false, { message: "Nieprawidłowy login lub hasło" });
    }
    if (user.password !== password) {
      return done(null, false, { message: "Nieprawidłowy login lub hasło" });
    }
    return done(null, user);
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (user_id, done) => {
  const user = await getUserById(user_id);
  done(null, user);
});

export default function (app) {
  app.use(passport.initialize());
  app.use(passport.session());
}