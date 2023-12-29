import { Model, DataTypes } from "sequelize";
import sequelize from "./db.sequelize";
import { UserType } from "../types/type";
export class AuthUser extends Model {
  password: string;
  id: bigint;
  email: string;
  full_name: string;
}
AuthUser.init(
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      field: "id",
    },
    full_name: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: "full_name",
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: "email",
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "password",
    },
    user_type: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: [UserType.ADMIN, UserType.LANDLORD, UserType.TENANT],
      field: "user_type",
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
    status: {
      type: DataTypes.ENUM,
      values: ['0', '1'],
      defaultValue: '0',
      field: 'status'
    },
    social_loginId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "social_loginId",
    },

  },
  { sequelize, paranoid: true, freezeTableName: true, modelName: "users" }
);
