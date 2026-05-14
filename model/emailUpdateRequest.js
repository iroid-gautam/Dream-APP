import { DataTypes } from "sequelize";
import sequelize from "./connection";

const EmailUpdateRequest = sequelize.define(
  "emailUpdateRequest",
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
    oldEmail: {
      type: DataTypes.STRING(160),
      allowNull: false,
      field: "old_email",
      set(value) {
        this.setDataValue(
          "oldEmail",
          value ? value.trim().toLowerCase() : null
        );
      },
    },
    newEmail: {
      type: DataTypes.STRING(160),
      allowNull: false,
      field: "new_email",
      set(value) {
        this.setDataValue(
          "newEmail",
          value ? value.trim().toLowerCase() : null
        );
      },
    },
    otp: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "expires_at",
    },
    isExpired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_expired",
    },
    isConsumed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_consumed",
    },
  },
  {
    tableName: "email_update_requests",
  }
);

export default EmailUpdateRequest;
