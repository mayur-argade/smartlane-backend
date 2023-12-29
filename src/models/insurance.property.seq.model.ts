import { Model, DataTypes } from "sequelize";
import sequelize from "./db.sequelize";
export class InsuranceProperty extends Model {

  id: bigint;
  property_id: bigint;
  expiry?: string;
}
InsuranceProperty.init(
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
    type: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "user_type",
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'provider'
    },
    expiry: {
      type: DataTypes.STRING(45),
      allowNull: true,
      field: 'expiry'
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
  { sequelize, paranoid: true, freezeTableName: true, modelName: "insurance" }
);
