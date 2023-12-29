import { Model, DataTypes } from "sequelize";
import sequelize from "./db.sequelize";

export class RoiProperty extends Model {
  id: bigint;
  property_id: bigint;
  property_estimate : bigint;
  gross_monthly_income: number;
  mortgage_payment: number;
  management_fee: number;
  ground_rent: number;
  service_charge: number;
  previous_monthly_net_income: number;
  monthly_net_income: number;
}
RoiProperty.init(
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
    property_estimate: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'property_estimate',
    },
    gross_monthly_income: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "gross_monthly_income",
    },
    mortgage_payment: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "mortgage_payment",
    },
    management_fee: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "management_fee",
    },
    ground_rent: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "ground_rent",
    },
    service_charge: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "service_charge",
    },
    monthly_net_income: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "monthly_net_income",
    },
    previous_monthly_net_income: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: "previous_monthly_net_income",
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
  { sequelize, paranoid: true, freezeTableName: true, modelName: "roi" }
);
