import { DataTypes } from "sequelize";
import sequelize from "./connection";

const DeviceToken = sequelize.define(
  "deviceToken",
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
    fcmToken: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      field: "fcm_token",
      set(value) {
        this.setDataValue("fcmToken", value ? value.trim() : null);
      },
    },
    platform: {
      type: DataTypes.ENUM("android", "ios", "web"),
      allowNull: false,
    },
    deviceId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "device_id",
      set(value) {
        this.setDataValue("deviceId", value ? value.trim() : null);
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active",
    },
    lastUsedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      field: "last_used_at",
    },
  },
  {
    tableName: "device_tokens",
    indexes: [
      {
        fields: ["user_id"],
      },
      {
        fields: ["user_id", "is_active"],
      },
      {
        unique: true,
        fields: ["user_id", "device_id"],
      },
    ],
  }
);

export default DeviceToken;
