require("dotenv").config();

const logger = require("./modules/_logger"),
  fs = require("fs"),
  domain = process.env.DOMAIN,
  key = fs
    .readdirSync(process.env.CERT_DIR)
    .sort()
    .find((e) => e.match(new RegExp(`^${domain}.*\.key`, "g"))),
  cert = fs
    .readdirSync(process.env.CERT_DIR)
    .sort()
    .find((e) => e.match(new RegExp(`^${domain}.*\.crt`, "g"))),
  httpServer = require("https").createServer({
    key:
      key !== undefined
        ? fs.readFileSync(`${process.env.CERT_DIR}/${key}`)
        : "",
    cert:
      cert !== undefined
        ? fs.readFileSync(`${process.env.CERT_DIR}/${cert}`)
        : "",
  }),
  io = require("socket.io")(httpServer, {
    cors: {
      origin: [
        `https://${domain}`,
        "http://dev.i-sds.ru",
        "http://dev.i-sds.ru:8090",
      ],
      methods: ["GET"],
    },
  }),
  redis = new (require("ioredis"))();

console.log(key, cert);

redis.psubscribe("*", function (error, count) {
  //
});

redis.on("pmessage", function (pattern, channel, message) {
  message = JSON.parse(message);
  io.emit(`${channel}:${message.event}`, message.data);
  console.log(`${channel}:${message.event}`);

  logger.info("Hello again distributed logs");
});

httpServer.listen(6001);

io.on("connection", (socket) => console.log(socket.id));
