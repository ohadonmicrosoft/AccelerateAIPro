import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // For development: Create a default user if none exists
  const defaultUser = {
    username: "demo",
    password: "demo123",
  };

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      // For development: Always authenticate successfully
      const user = await storage.getUserByUsername("demo") || 
        await storage.createUser({
          username: defaultUser.username,
          password: await hashPassword(defaultUser.password),
        });
      return done(null, user);
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });

  // For development: Auto-authenticate on register
  app.post("/api/register", async (req, res, next) => {
    const user = await storage.getUserByUsername("demo") || 
      await storage.createUser({
        username: defaultUser.username,
        password: await hashPassword(defaultUser.password),
      });

    req.login(user, (err) => {
      if (err) return next(err);
      res.status(201).json(user);
    });
  });

  // For development: Auto-authenticate on login
  app.post("/api/login", async (req, res, next) => {
    const user = await storage.getUserByUsername("demo") || 
      await storage.createUser({
        username: defaultUser.username,
        password: await hashPassword(defaultUser.password),
      });

    req.login(user, (err) => {
      if (err) return next(err);
      res.status(200).json(user);
    });
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", async (req, res) => {
    // For development: Always return the demo user
    const user = await storage.getUserByUsername("demo") || 
      await storage.createUser({
        username: defaultUser.username,
        password: await hashPassword(defaultUser.password),
      });
    res.json(user);
  });
}