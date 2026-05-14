import bcrypt from "bcryptjs";
import { DataTypes } from "sequelize";
import sequelize from "./connection";
import { AUTH_PROVIDER, BCRYPT } from "../src/common/constants/constant";

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(160),
      allowNull: true,
      unique: true,
      set(value) {
        this.setDataValue("email", value ? value.trim().toLowerCase() : null);
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    profileImage: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      field: "profile_image",
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
    isForgotPasswordVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_forgot_password_verified",
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
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, BCRYPT.SALT_ROUND);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password") && user.password) {
          user.password = await bcrypt.hash(user.password, BCRYPT.SALT_ROUND);
        }
      },
    },
  }
);

User.prototype.isPasswordMatch = async function (password) {
  if (!this.password) {
    return false;
  }

  return bcrypt.compare(password, this.password);
};

export default User;
