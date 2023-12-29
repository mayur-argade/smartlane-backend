import { Model, DataTypes } from "sequelize";
import sequelize from "./db.sequelize";

export class LettingProperty extends Model {
  id: bigint;
  property_id?: bigint;
  beneficiary_id?:number;
  current_tenent: string;
  tenant_expiry: string;
}
LettingProperty.init(
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
    beneficiary_id:{
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'beneficiary_id',
    },
    payprop_property_id:{
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'payprop_property_id',
    },
    current_tenent: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: 'current_tenent',
    },
    tenant_expiry: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: 'tenant_expiry'
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
  { sequelize, paranoid: true, freezeTableName: true, modelName: "letting" }
);
