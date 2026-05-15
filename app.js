import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";
import routes from "./routes/index";
import { connectDatabase, syncDatabase } from "./model/connection";
import "./model/user";
import "./model/otp";
import "./model/accessToken";
import "./model/refreshToken";
import "./model/godWhisper";
import "./model/goal";
import "./model/deviceToken";
import "./model/dailyGoalGeneration";
import errorHandler from "./src/common/middlewares/error-handler.middleware";
import swagger from "./src/common/config/swagger";
import logger from "./src/common/logger";
import requestLogger from "./src/common/middlewares/request-logger.middleware";
import "./src/common/config/jwt-strategy";
import "./src/common/config/passport-strategies";
import { initializeFirebase } from "./src/common/config/firebase";
import "./cronJob";
import { runSeeders } from "./seeder";
import registerQueueEvents from "./src/queues/events/queue-events";
import "./src/queues/workers/generationScheduler.worker";
import "./src/queues/workers/scriptGeneration.worker";
import "./src/queues/workers/audioGeneration.worker";
import "./src/queues/workers/notificationDelivery.worker";

const appLogger = logger.withLabel("APP");

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET || "booking-app-session-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(requestLogger);

app.get("/health", (req, res) => {
  return res.send({ message: "Booking service is running." });
});

app.use("/api/documentation", swagger);
app.use("/", routes);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDatabase();
    await syncDatabase();
    await runSeeders();
    initializeFirebase();
    registerQueueEvents();

    app.listen(process.env.PORT, () => {
      appLogger.info("Server started successfully.", {
        baseUrl: `${process.env.BASE_URL}:${process.env.PORT}`,
        port: process.env.PORT,
      });
    });
  } catch (error) {
    appLogger.error("Server failed to start.", {
      message: error?.message || "Unknown error",
      stack: error?.stack || null,
    });
    process.exit(1);
  }
};

startServer();
