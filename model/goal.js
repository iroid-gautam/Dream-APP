import { DataTypes } from "sequelize";
import sequelize from "./connection";

const Goal = sequelize.define(
  "goal",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      set(value) {
        this.setDataValue("username", value ? value.trim() : null);
      },
    },
    dream: {
      type: DataTypes.TEXT,
      allowNull: false,
      set(value) {
        this.setDataValue("dream", value ? value.trim() : null);
      },
    },
    godWhisperIds: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      field: "god_whisper_ids",
      get() {
        const value = this.getDataValue("godWhisperIds");
        if (!Array.isArray(value)) {
          return [];
        }

        return value.filter((id) => typeof id === "string" && id.trim() !== "");
      },
      set(value) {
        if (!Array.isArray(value)) {
          this.setDataValue("godWhisperIds", []);
          return;
        }

        const normalized = Array.from(
          new Set(
            value
              .filter((id) => typeof id === "string")
              .map((id) => id.trim())
              .filter(Boolean)
          )
        );

        this.setDataValue("godWhisperIds", normalized);
      },
    },
    reminderTime: {
      type: DataTypes.STRING(5),
      allowNull: false,
      field: "reminder_time",
    },
    timezone: {
      type: DataTypes.STRING(100),
      allowNull: false,
      set(value) {
        this.setDataValue("timezone", value ? value.trim() : null);
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active",
    },
    activatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "activated_at",
    },
    deactivatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      field: "deactivated_at",
    },
    reminderEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "reminder_enabled",
    },
    lastReminderSentAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      field: "last_reminder_sent_at",
    },
  },
  {
    tableName: "goals",
    indexes: [
      {
        fields: ["user_id", "is_active"],
      },
      {
        fields: ["reminder_enabled", "is_active", "reminder_time"],
      },
    ],
  }
);

export default Goal;
