import { Property } from "../models/property.seq.model";
import { AuthUser } from "../models/authuser.seq.model";
import { UserEdit, UserRegister } from "../types/type";
import { PasswordUtil } from "../utils/utils.bcrypt";
import { QueryTypes } from 'sequelize';

export class AdminRepo {

    async getUserDataByEmail(info: UserRegister) {
        return new Promise<UserRegister>((res, rej) => {
            AuthUser.findOne({
                where: { email: info.email }
            }).then((user: UserRegister) => {
                res(user);
            }).catch((err) => {
                rej(err);
            });
        });
    }

    async register(user: UserRegister) {
        return new Promise<any>((res, rej) => {
            const passwordUtil = new PasswordUtil(user.password);
            user.password = passwordUtil.getHash();
            AuthUser.create({
                email: user.email,
                full_name: user.full_name,
                password: user.password,
                user_type: user.user_type,
                status: '1'
            }).then((data) => {
                res(data);
            }).catch((err) => {
                rej(err);
            });
        });
    }

    async updateUser(id: number, user: UserEdit) {
        return new Promise<any>((res, rej) => {
            if (user.password) {
                const passwordUtil = new PasswordUtil(user.password);
                user.password = passwordUtil.getHash();
            }
            AuthUser.update({
                email: user.email,
                full_name: user.full_name,
                password: user.password,
                user_type: user.user_type,
            }, { where: { id: user.id } })
                .then((data) => {
                    res(data);
                })
                .catch((err) => {
                    rej(err);
                });
        });
    }

    async propertyList() {
        return new Promise<any>((res, rej) => {
            Property.sequelize.query("SELECT property.id,users.id AS userId, users.full_name AS userName, users.user_type AS users_userType, property.property_name, property.address,property.property_estimate, roi.property_id, roi.gross_monthly_income, roi.mortgage_payment, roi.management_fee, roi.ground_rent, roi.service_charge, mortgage.debt, mortgage.type AS mortgage_type, mortgage.interest_rate, mortgage.provider AS mortgage_provider, mortgage.expiry AS mortgage_expiry, ownership.company_number, ownership.type AS ownership_type, insurance.provider AS insurance_provider, insurance.user_type as insurance_type, insurance.expiry AS insurance_expiry, letting.current_tenent, letting.tenant_expiry FROM users INNER JOIN property ON users.id = property.user_id INNER JOIN roi ON property.id = roi.property_id INNER JOIN mortgage ON property.id = mortgage.property_id INNER JOIN ownership ON property.id = ownership.property_id INNER JOIN insurance ON property.id = insurance.property_id INNER JOIN letting ON property.id = letting.property_id",
                { type: QueryTypes.SELECT })
                .then((data) => {
                    res(data);
                }).catch((err) => {
                    rej(err);
                });
        });
    }

    async findByPropertyId(id: number) {
        return new Promise<any>((res, rej) => {
            Property.destroy({
                where: { id: id },
                force: true,
            }).then((user) => {
                res(user);
            }).catch((err) => {
                rej(err);
            });
        });
    }

    async filterUsers(name: string) {
        return new Promise<any>((res, rej) => {
            Property.sequelize.query("SELECT users.id, users.full_name AS userName, users.user_type  FROM users  WHERE full_name LIKE :search_name AND users.user_type <> 'admin'",
                { logging: console.log, replacements: { search_name: '%' + name + '%' }, type: QueryTypes.SELECT }
            ).then((data) => {
                res(data);
            }).catch((err) => {
                rej(err);
            });
        });
    }

}
