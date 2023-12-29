import { Model, DataTypes, EnumDataType } from 'sequelize'
import sequelize from './db.sequelize'
import { NotificationStatus } from '../types/type';

export class DocNotification extends Model {
    id: bigint;
    user_id: bigint;
    title: string;
    message: string;
    seen: string;
    cleared: boolean
}

DocNotification.init(
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
        title: {
            type: DataTypes.STRING(45),
            allowNull: false,
            field: 'title'
        },
        message: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'message'
        },
        cleared: {
            type: DataTypes.BOOLEAN,
            field: 'cleared'
        },
        seen: {
            type: DataTypes.ENUM,
            values: [NotificationStatus.UNSEEN, NotificationStatus.SEEN],
            defaultValue: '0',
            field: 'seen'
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
    { sequelize, paranoid: true, freezeTableName: true, modelName: 'docs_notification' }
);