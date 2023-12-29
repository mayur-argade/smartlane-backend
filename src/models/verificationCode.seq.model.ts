import { Model, DataTypes } from 'sequelize'
import sequelize from './db.sequelize'

export class VerificationCode extends Model {
    user_id: bigint;
    code: string;
    OtpExpirationDate: string;
}

VerificationCode.init(
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
        code: {
            type: DataTypes.STRING(45),
            allowNull: false,
            field: 'code'
        },
        OtpExpirationDate: {
            type: DataTypes.STRING(45),
            allowNull: false,
            field: 'OtpExpirationDate'
        },
        status: {
            type: DataTypes.ENUM,
            values: ['0', '1', '2'],
            defaultValue: '0',
            field: 'status'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'created_at'
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'updated_at'
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "deleted_at",
        },

    },
    { sequelize, paranoid: true, freezeTableName: true, modelName: 'verification_codes' }
);