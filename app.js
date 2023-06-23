import express from "express";
import path from "path";
import session from "express-session";
import fs from "fs";
import swagger from "./src/common/config/swagger";
import errorHandler from "./src/common/middlewares/error-handler.middleware";
import passport from "passport";
import routes from "./routes/index";
import mongoConnection from "./model/connection";
import "./src/common/config/jwt-strategy";

import "./seeder/index";

require("dotenv").config();

const app = express();
mongoConnection();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(
  session({ secret: "hjs89d", resave: "false", saveUninitialized: "true" })
);


app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(`${__dirname}/public`));
app.use("/media", express.static(path.join(__dirname, "media")));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  return res.render("errors/500");
});

app.use("/api/documentation", swagger);
app.use("/", routes);
app.use(errorHandler);

const isSecure = process.env.IS_SECURE === "true";

if (isSecure) {
  var options = {
    key: fs.readFileSync(`${process.env.SSL_CERT_BASE_PATH}/privkey.pem`),
    cert: fs.readFileSync(`${process.env.SSL_CERT_BASE_PATH}/cert.pem`),
    ca: [
      fs.readFileSync(`${process.env.SSL_CERT_BASE_PATH}/cert.pem`),
      fs.readFileSync(`${process.env.SSL_CERT_BASE_PATH}/fullchain.pem`),
    ],
  };
  var https = require("https").Server(options, app);

  https.listen(process.env.PORT, () => {
    console.log(
      `Https server is running on ${process.env.BASE_URL}:${process.env.PORT}`
    );
  });
} else {
  app.listen(process.env.PORT, () => {
    console.log(`listening at ${process.env.BASE_URL}:${process.env.PORT}`);
  });
}
