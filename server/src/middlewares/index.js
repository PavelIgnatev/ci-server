const { json } = require("express");
const disablePoweredBy = require("./disablePoweredBy");

const rateLimiter = require("express-rate-limit");
const slowDown = require("express-slow-down");


module.exports = (app) => {
  app.use(json());

  app.use(disablePoweredBy);

  const limiter = rateLimiter({
    windowMs: 1 * 60 * 1000,
    max: 120,
  });

  const speedLimiter = slowDown({
    windowMs: 1 * 60 * 1000,
    delayAfter: 100,
    delayMs: 1000,
  });

  app.use(limiter);
  app.use(speedLimiter);
};
