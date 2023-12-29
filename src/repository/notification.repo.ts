import { Notification } from "../models/notification.seq.model";
import { Op, QueryTypes } from 'sequelize';
import { LettingProperty } from '../models/letting.property.seq.model';
import { Property } from '../models/property.seq.model';
import { DocNotification } from "../models/docs.notification.seq.model";

export class NotificationRepo {
    async getNotificationDetailById(id: bigint,) {
        return new Promise<any>((res, rej) => {
            Notification.findAll({
                where: { [Op.and]: [{ user_id: id }, { cleared: false }, { seen: "0" }] },
                order: [["id", "desc"]],
            })
                .then((data) => {
                    res(data)
                })
                .catch((err) => {
                    rej(err)
                })
        })
    }

    async countNotification(id: bigint,) {
        return new Promise<any>((res, rej) => {
            Notification.count({
                where: { [Op.and]: [{ user_id: id }, { cleared: false }, { seen: "0" }] }
            })
                .then((data) => {
                    res(data)
                })
                .catch((err) => {
                    rej(err)
                })
        })
    }

    async clearNotification(id: bigint) {
        return new Promise<any>((res, rej) => {
            Notification.update(
                { cleared: true },
                { where: { user_id: id } }
            )
                .then((data) => {
                    res(data)
                })
                .catch((err) => {
                    rej(err)
                })
        })
    }

    async seenNotification(userId: bigint, id: bigint) {
        return new Promise<any>((res, rej) => {
            Notification.findOne(
                { where: { [Op.and]: [{ user_id: userId }, { id: id }, { seen: "0" }] } }
            )
                .then((data) => {
                    res(data)
                })
                .catch((err) => {
                    rej(err)
                })
        })
    }

    async seenNotifications(id: bigint) {
        return new Promise<any>((res, rej) => {
            Notification.update(
                { seen: "1" },
                { where: { id: id } }
            )
                .then((data) => {
                    res(data)
                })
                .catch((err) => {
                    rej(err)
                })
        })
    }

    async getuserdetail(id: bigint) {
        return new Promise<any>((res, rej) => {
            Property.findAll({
                where: { user_id: id },
            })
                .then((data) => {
                    res(data)
                })
                .catch((err) => {
                    rej(err)
                })
        })
    }

    async expireLetting(propertyId: bigint) {
        return new Promise<any>((res, rej) => {
            LettingProperty.findOne({
                where: { property_id: propertyId }
            })
                .then((data) => {
                    res(data)
                })
                .catch((err) => {
                    rej(err)
                })
        })
    }

    async expireInsurance(id: bigint) {
        return new Promise<any>((res, rej) => {
            Property.sequelize.query("SELECT property.id AS propertyId,property.address, users.id AS userId, insurance.expiry AS insurance_expiry FROM users INNER JOIN property ON users.id = property.user_id INNER JOIN insurance ON property.id = insurance.property_id WHERE users.id = :user_id ",
                { replacements: { user_id: id }, type: QueryTypes.SELECT })
                .then((data) => {
                    res(data);

                }).catch((err) => {
                    rej(err);
                });
        });
    }

    async notificationSend(id: bigint, propertyID: bigint, title: string, message: string) {
        return new Promise<any>(async (res, rej) => {
            await Notification.create({
                user_id: id,
                property_id: propertyID,
                title: title,
                message: message,
                cleared: false,
            })
                .then((data) => {
                    res(data)
                })
                .catch((err) => {
                    rej(err)
                })
        })
    }

    async notificationUpdate(id: bigint, propertyID: bigint, title: string, message: string) {
        return new Promise<any>(async (res, rej) => {
            await Notification.upsert({
                user_id: id,
                property_id: propertyID,
                title: title,
                message: message,
                cleared: false,
            })
                .then((data) => {
                    res(data)
                })
                .catch((err) => {
                    rej(err)
                })
        })
    }

    async getNotifyById(id: bigint, propertyId: bigint) {
        return new Promise<any>((res, rej) => {
            Notification.findOne({
                where: { [Op.and]: [{ user_id: id }, { property_id: propertyId }] },
                order: [["id", "desc"]],
            })
                .then((data) => {
                    res(data)
                })
                .catch((err) => {
                    rej(err)
                })
        })
    }

    async documentList(id: bigint) {
        return new Promise<any>((res, rej) => {
            Property.sequelize.query("SELECT property.id AS propertyId, property.address, users.id AS userId, document.id AS documentId, document.mortgage_statement_expiry_date, document.landlord_insurance_expiry_date, document.tenancy_aggrement_expiry_date, document.electrical_report_eicr_expiry_date, document.portable_appliance_testing_expiry_date, document.energy_performance_epc_expiry_date, term_of_business_expiry_date FROM users INNER JOIN property ON users.id = property.user_id INNER JOIN document ON property.id = document.property_id WHERE users.id = :user_id",
                { replacements: { user_id: id }, type: QueryTypes.SELECT })
                .then((data) => {
                    res(data);
                }).catch((err) => {
                    rej(err);
                });
        });
    }

    async docNotificationSend(id: bigint, propertyID: bigint, title: string, message: string) {
        return new Promise<any>(async (res, rej) => {
            await DocNotification.create({
                user_id: id,
                property_id: propertyID,
                title: title,
                message: message,
                cleared: false,
            })
                .then((data) => {
                    res(data)
                })
                .catch((err) => {
                    rej(err)
                })
        })
    }

    async getDocNotificationDetailById(id: bigint) {
        return new Promise<any>((res, rej) => {
            DocNotification.findAll({
                where: {
                    [Op.and]: [{ user_id: id }, { cleared: false }, { seen: "0" }]
                },
                order: [["id", "desc"]],
            })
                .then((data) => {
                    res(data)
                })
                .catch((err) => {
                    rej(err)
                })
        })
    }

    async getExistingNotification(userId: bigint, propertyId: bigint, title: string, message: string) {
        return new Promise<any>((res, rej) => {
            DocNotification.findOne({
                where: { [Op.and]: [{ user_id: userId }, { property_id: propertyId }, { title: title }, { message: message }] },
                order: [["id", "desc"]],
                limit: 1
            })
                .then((data) => {
                    res(data)
                })
                .catch((err) => {
                    rej(err)
                })
        })
    }

    async docNotificationUpdate(id: bigint, message: string) {
        return new Promise<any>(async (res, rej) => {
            await DocNotification.upsert({
                id: id,
                message: message,
                cleared: false,
            })
                .then((data) => {
                    res(data)
                })
                .catch((err) => {
                    rej(err)
                })
        })
    }

    async clearDocNotification(id: bigint) {
        return new Promise<any>((res, rej) => {
            DocNotification.update(
                { cleared: true },
                { where: { user_id: id } }
            )
                .then((data) => {
                    res(data)
                })
                .catch((err) => {
                    rej(err)
                })
        })
    }

    async seenDocNotification(userId: bigint, id: bigint) {
        return new Promise<any>((res, rej) => {
            DocNotification.findOne(
                { where: { [Op.and]: [{ user_id: userId }, { id: id }, { seen: "0" }] } }
            )
                .then((data) => {
                    res(data)
                })
                .catch((err) => {
                    rej(err)
                })
        })
    }

    async seenDocNotifications(id: bigint) {
        return new Promise<any>((res, rej) => {
            DocNotification.update(
                { seen: "1" },
                { where: { id: id } }
            )
                .then((data) => {
                    res(data)
                })
                .catch((err) => {
                    rej(err)
                })
        })
    }
}