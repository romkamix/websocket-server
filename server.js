require("dotenv").config();

const fs = require("fs");

const domain = process.env.DOMAIN,
  key = fs
    .readdirSync(process.env.CERT_DIR)
    .sort()
    .find((e) => e.match(new RegExp(`${domain}.*\.key`, "g"))),
  cert = fs
    .readdirSync(process.env.CERT_DIR)
    .sort()
    .find((e) => e.match(new RegExp(`${domain}.*\.crt`, "g"))),
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
      origin: `https://${domain}`,
      methods: ["GET"],
    },
  }),
  Redis = require("ioredis"),
  redis = new Redis();

redis.psubscribe("*", function (error, count) {
  //
});

redis.on("pmessage", function (pattern, channel, message) {
  message = JSON.parse(message);
  io.emit(channel + ":" + message.event, message.data);
});

httpServer.listen(6001);

io.on("connection", (socket) => console.log(socket.id));
