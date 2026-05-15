import { DataTypes } from "sequelize";
import sequelize from "./connection";

const DailyGoalGeneration = sequelize.define(
  "dailyGoalGeneration",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    goalId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "goal_id",
      references: {
        model: "goals",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
      references: {
        model: "users",
        key: "id",
      },
    },
    generationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "generation_date",
    },
    generationStatus: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "pending",
      field: "generation_status",
    },
    script: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
    },
    audio: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
    },
    delivered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      field: "delivered_at",
    },
    retryCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "retry_count",
    },
    errorLogs: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      field: "error_logs",
    },
  },
  {
    tableName: "daily_goal_generations",
    indexes: [
      {
        unique: true,
        fields: ["goal_id", "generation_date"],
      },
      {
        fields: ["user_id", "generation_status"],
      },
      {
        fields: ["delivered", "generation_status"],
      },
    ],
  }
);

export default DailyGoalGeneration;
