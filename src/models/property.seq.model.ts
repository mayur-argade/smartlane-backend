import { Model, DataTypes } from "sequelize";
import sequelize from "./db.sequelize";
import { Documents } from "./docment.property.seq.model";

export class Property extends Model {
    id: bigint;
    user_id?: bigint
    property_name?: string
    address?: string
    property_estimate: bigint;
    property_margin: number;
}
Property.init(
    {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            field: 'id'
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            field: 'user_id',
            references: {
                model: 'users',
                key: 'id'
            }
        },
        property_name: {
            type: DataTypes.STRING(45),
            allowNull: false,
            field: "property_name",
        },
        address: {
            type: DataTypes.STRING(45),
            allowNull: false,
            field: "address",
        },
        property_estimate: {
            type: DataTypes.BIGINT,
            allowNull: false,
            field: "property_estimate",
        },
        property_margin: {
            type: DataTypes.BIGINT,
            allowNull: false,
            field: "property_margin",
        },
        date_now: {
            type: DataTypes.STRING(45),
            allowNull: true,
            field: 'date_now'
        },
        previous_estimate: {
            type: DataTypes.BIGINT,
            allowNull: true,
            field: "previous_estimate",
        },
        previous_margin: {
            type: DataTypes.BIGINT,
            allowNull: true,
            field: "previous_margin",
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "created_at",
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'updatedAt'
        },
    },
    { sequelize, paranoid: true, freezeTableName: true, modelName: 'property' }
);

Property.hasOne(Documents, { foreignKey: 'property_id', as: 'documentDetail' });
Property.hasOne(Documents, { foreignKey: 'property_id', as: 'lettingDetail' });
Property.hasOne(Documents, { foreignKey: 'property_id', as: 'documentExpiry' });
Property.hasOne(Documents, { foreignKey: 'property_id', as: 'lettingExpiry' });

