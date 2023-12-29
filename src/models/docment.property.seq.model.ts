import { Model, DataTypes } from "sequelize";
import sequelize from "./db.sequelize";

export class Documents extends Model {
    id: bigint;
    user_id: bigint;
    mortgage_statement: string;
    tenancy_aggrement: string;
    landlord_insurance: string;
    electrical_report_eicr: string;
    portable_appliance_testing: string;
    energy_performance_epc: string;
    term_of_business: string;
    mortgage_statement_expiry_date?: string
    tenancy_aggrement_expiry_date?: string
    electrical_report_eicr_expiry_date?: string
    landlord_insurance_expiry_date?: string
    portable_appliance_testing_expiry_date?: string
    energy_performance_epc_expiry_date?: string
    term_of_business_expiry_date?: string
}
Documents.init(
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
            unique: true,
            field: 'property_id',
            onDelete: 'CASCADE',
            references: {
                model: 'property',
                key: 'id',
            }
        },
        mortgage_statement: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'mortgage_statement',
        },
        tenancy_aggrement: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'tenancy_aggrement'
        },
        landlord_insurance: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'landlord_insurance',
        },
        electrical_report_eicr: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'electrical_report_eicr',
        },
        portable_appliance_testing: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'portable_appliance_testing',
        },
        energy_performance_epc: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'energy_performance_epc',
        },
        term_of_business: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'term_of_business',
        },
        mortgage_statement_expiry_date: {
            type: DataTypes.STRING(45),
            allowNull: true,
            field: 'mortgage_statement_expiry_date',
        },
        tenancy_aggrement_expiry_date: {
            type: DataTypes.STRING(45),
            allowNull: true,
            field: 'tenancy_aggrement_expiry_date',
        },
        electrical_report_eicr_expiry_date: {
            type: DataTypes.STRING(45),
            allowNull: true,
            field: 'electrical_report_eicr_expiry_date',
        },
        landlord_insurance_expiry_date: {
            type: DataTypes.STRING(45),
            allowNull: true,
            field: 'landlord_insurance_expiry_date',
        },
        portable_appliance_testing_expiry_date: {
            type: DataTypes.STRING(45),
            allowNull: true,
            field: 'portable_appliance_testing_expiry_date',
        },
        energy_performance_epc_expiry_date: {
            type: DataTypes.STRING(45),
            allowNull: true,
            field: 'energy_performance_epc_expiry_date',
        },
        term_of_business_expiry_date: {
            type: DataTypes.STRING(45),
            allowNull: true,
            field: 'term_of_business_expiry_date',
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
    { sequelize, paranoid: true, freezeTableName: true, modelName: "document" }
);
