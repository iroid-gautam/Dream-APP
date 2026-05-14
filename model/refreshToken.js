import { DataTypes } from "sequelize";
import sequelize from "./connection";

const RefreshToken = sequelize.define(
  "refreshToken",
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
    accessToken: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "access_token",
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "expires_at",
    },
    isRevoked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_revoked",
    },
  },
  {
    tableName: "refresh_tokens",
  }
);

export default RefreshToken;
