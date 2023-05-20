import express from "express";
import passport from "passport";
import LocalStrategy from "passport-local";
import db from "../connect.js";
import bcrypt from "bcrypt";
import { aclAuth } from "../controllers/aclAuth.js";
import { Strategy as JwtStrategy } from "passport-jwt";
import dotenv from "dotenv";
import path from "path";
import jwt from "jsonwebtoken";

dotenv.config({ path: path.resolve(".env") });

const router = express.Router();

router.get("/current-session", (req, res) => {
  if (new Date(req.session.cookie._expires).getTime() > new Date().getTime()) {
    res.send({ sessionExpired: false });
  } else {
    res.send({ sessionExpired: true });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (!user) {
      return res.status(401).send({ success: false, message: info.message });
    }

    req.login(user, (err) => {
      if (err) {
        return res.status(500).send(err);
      }

      res.send({ success: true, user: user });
    });
  })(req, res, next);
});

passport.use(
  new LocalStrategy((username, password, done) => {
    const query = `SELECT * FROM users WHERE login=?`;
    db.query(query, [username], async (err, result) => {
      if (err) {
        return done(err);
      }

      if (result.length === 0) {
        return done(null, false, { message: "Nieprawidłowy login lub hasło" });
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        result[0].password
      );
      if (isPasswordValid) {
        return done(null, result[0]);
      } else {
        return done(null, false, { message: "Nieprawidłowy login lub hasło" });
      }
    });
  })
);

// passport.use(
//   new JwtStrategy(
//     {
//       jwtFromRequest: (req) => req.session.jwt,
//       secretOrKey: process.env.JWT_SECRET_KEY,
//     },
//     (payload, done) => {
//       // TODO: add additional jwt token verification
//       return done(null, payload);
//     }
//   )
// );

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.login });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

router.post("/logout", function (req, res, next) {
  req.session.destroy((err) => {
    res
      .clearCookie("workspacex-session", { domain: "localhost", path: "/" })
      .send("cleared cookie");
  });
});

export default router;
