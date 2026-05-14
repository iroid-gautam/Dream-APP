import { DataTypes } from "sequelize";
import sequelize from "./connection";

const HelpSupportRequest = sequelize.define(
  "helpSupportRequest",
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
    type: {
      type: DataTypes.ENUM("feedback", "feature_request", "problem_report"),
      allowNull: false,
      defaultValue: "feedback",
      set(value) {
        this.setDataValue("type", value ? value.trim() : "feedback");
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      set(value) {
        this.setDataValue("description", value ? value.trim() : null);
      },
    },
  },
  {
    tableName: "help_support_requests",
    updatedAt: false,
    indexes: [
      {
        fields: ["user_id"],
      },
      {
        fields: ["type"],
      }
    ],
  }
);

export default HelpSupportRequest;
