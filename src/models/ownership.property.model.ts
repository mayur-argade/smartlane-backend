import { Model, DataTypes } from "sequelize";
import sequelize from "./db.sequelize";
import { OwnershipType } from "../types/type";

export class OwnershipProperty extends Model {
  id: bigint;
  property_id: bigint;
  company_number: Number;
}
OwnershipProperty.init(
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      field: 'id'
    },
    property_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'property_id',
      onDelete: 'CASCADE',
      references: {
        model: 'property',
        key: 'id'
      }
    },
    company_number: {
      type: DataTypes.STRING(45),
      allowNull: true,
      field: "company_number",
    },
    type: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: [OwnershipType.PERSONAL, OwnershipType.LTD_COMPANY],
      field: "type",
    },
    property_type: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "property_type",
    },
    construction_date: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "construction_date",
    },
    no_of_bedroom: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "no_of_bedroom",
    },
    no_of_bathroom: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "no_of_bathroom",
    },
    finish_quality: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "finish_quality",
    },
    outdoor_space: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "outdoor_space",
    },
    off_street_parking: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "off_street_parking",
    },
    internal_area: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "internal_area",
    },
    post_code: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "post_code",
  },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "updated_at",
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "deleted_at",
    },
  },
  { sequelize, paranoid: true, freezeTableName: true, modelName: "ownership" }
);
