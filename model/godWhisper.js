import { DataTypes } from "sequelize";
import sequelize from "./connection";

const GodWhisper = sequelize.define(
  "godWhisper",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      set(value) {
        this.setDataValue("message", value ? value.trim() : null);
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active",
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "sort_order",
    },
  },
  {
    tableName: "god_whispers",
    indexes: [
      {
        fields: ["is_active", "sort_order"],
      },
    ],
  }
);

export default GodWhisper;
