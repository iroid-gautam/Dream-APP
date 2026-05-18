import { DataTypes } from "sequelize";
import sequelize from "./connection";
import { AUTH_PROVIDER } from "../src/common/constants/constant";

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(60),
      allowNull: true,
      field: "first_name",
    },
    lastName: {
      type: DataTypes.STRING(60),
      allowNull: true,
      field: "last_name",
    },
    email: {
      type: DataTypes.STRING(160),
      allowNull: true,
      unique: true,
      set(value) {
        this.setDataValue("email", value ? value.trim().toLowerCase() : null);
      },
    },
    profileImage: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      field: "profile_image",
    },
    timezone: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
      set(value) {
        this.setDataValue("timezone", value ? value.trim() : null);
      },
    },
    termCondition: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "term_condition",
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_verified",
    },
    resetToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "reset_token",
    },
    providerType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: AUTH_PROVIDER.LOCAL,
      field: "provider_type",
      validate: {
        isIn: [Object.values(AUTH_PROVIDER)],
      },
    },
    providerId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
      field: "provider_id",
    },
    lastLoginProvider: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
      field: "last_login_provider",
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_deleted",
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      field: "deleted_at",
    },
  },
  {
    tableName: "users",
  }
);

export default User;
