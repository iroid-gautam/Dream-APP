import { Sequelize } from "sequelize";
import logger from "../src/common/logger";

const dbLogger = logger.withLabel("DATABASE");

const sequelize = new Sequelize(
  process.env.DB_NAME || "",
  process.env.DB_USER || "",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    dialect: process.env.DB_DIALECT || "mysql",
    logging:
      `${process.env.DB_LOGGING || "false"}`.toLowerCase() === "true"
        ? (message) => dbLogger.debug(message)
        : false,
    define: {
      underscored: true,
      freezeTableName: true,
      timestamps: true,
    },
  }
);

export const connectDatabase = async () => {
  await sequelize.authenticate();
  dbLogger.info("Database connection established successfully.", {
    host: process.env.DB_HOST || "127.0.0.1",
    database: process.env.DB_NAME || "",
    dialect: process.env.DB_DIALECT || "mysql",
  });
};

export const syncDatabase = async () => {
  await sequelize.sync();
  dbLogger.info("Database models synchronized successfully.");
};

export default sequelize;
