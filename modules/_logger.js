const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;

const myFormat = printf(
  ({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`
);

const logger = createLogger({
  level: "info",
  format: combine(timestamp(), myFormat),
  defaultMeta: { service: "user-service" },
  transports: [
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

module.exports = logger;
