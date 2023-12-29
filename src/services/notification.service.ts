import moment = require("moment");
import { Notification } from "../models/notification.seq.model";
import { NotificationRepo } from "../repository/notification.repo";
import { NotificationPropertys, NotificationType } from "../types/type";
import { appErrorMessage } from "../utils/appErrorMessage";
import { restApiResponseStatus } from "../utils/restApiResponseStatus";
import { PropertyRepo } from "../repository/property.repo";

export class NotificationService {
  constructor(
    private readonly notificationRepo: NotificationRepo,
    private readonly propertyRepo: PropertyRepo
  ) {}

  async allNotifications(id: bigint): Promise<NotificationPropertys> {
    const notification = await this.notificationRepo.getNotificationDetailById(
      id
    );
    if (!notification) {
      return {
        success: false,
        status: restApiResponseStatus.BadRequest,
        msg: "No notifications",
      };
    }
    return {
      success: true,
      status: restApiResponseStatus.OK,
      msg: "Notification lists get successfully.",
      data: { notification },
    };
  }

  async docsNotifications(id: bigint): Promise<NotificationPropertys> {
    const notifications =
      await this.notificationRepo.getDocNotificationDetailById(id);
    if (!notifications) {
      return {
        success: false,
        status: restApiResponseStatus.BadRequest,
        msg: "No notifications",
      };
    }
    return {
      success: true,
      status: restApiResponseStatus.OK,
      msg: "Notification lists get successfully.",
      data: { notifications },
    };
  }

  async countNotifications(id: bigint): Promise<NotificationPropertys> {
    const notification = await this.notificationRepo.countNotification(id);
    if (!notification) {
      return {
        success: false,
        status: restApiResponseStatus.BadRequest,
        msg: "Notifications list not found",
      };
    }
    return {
      success: true,
      status: restApiResponseStatus.OK,
      msg: "Notification counts.",
      data: { notification },
    };
  }

  async clearNotifications(id: bigint): Promise<NotificationPropertys> {
    const notification = await this.notificationRepo.clearNotification(id);
    if (!notification) {
      return {
        success: false,
        status: restApiResponseStatus.BadRequest,
        msg: "Notifications not clear",
      };
    }
    return {
      success: true,
      status: restApiResponseStatus.OK,
      msg: "Notifications clear successfully",
      data: { notification },
    };
  }

  async seenNotifications(
    id: bigint,
    data: NotificationType
  ): Promise<NotificationPropertys> {
    const notification = await this.notificationRepo.seenNotification(
      id,
      data.id
    );
    if (!notification) {
      return {
        success: false,
        status: restApiResponseStatus.BadRequest,
        msg: appErrorMessage.DATANOTFOUND,
      };
    }
    const notifications = await this.notificationRepo.seenNotifications(
      notification.id
    );
    if (!notifications) {
      return {
        success: false,
        status: restApiResponseStatus.BadRequest,
        msg: appErrorMessage.DATANOTFOUND,
      };
    }
    return {
      success: true,
      status: restApiResponseStatus.OK,
      msg: "Notifications seen succefully",
      data: { notifications },
    };
  }

  async tenantExpireNotifications(id: bigint): Promise<NotificationPropertys> {
    const letting = await this.notificationRepo.getuserdetail(id);
    if (!letting) {
      return {
        success: false,
        status: restApiResponseStatus.NotFound,
        msg: "No tenant found",
      };
    }
    const tenant = await this.notificationRepo.expireLetting(letting.id);
    const expirationDate = moment(tenant.tenant_expiry, "DD/MM/YYYY").toDate();
    const twoMonthFromNow = moment().add(2, "month").startOf("day").toDate();

    if (expirationDate.getTime() === twoMonthFromNow.getTime()) {
      const message = `Your tenant are leaving on ${tenant.tenant_expiry} (in 2 months).`;
      const Title = `${letting.address}`;
      await Notification.create({
        user_id: id,
        title: Title,
        message: message,
        cleared: false,
      });
      return {
        success: true,
        status: restApiResponseStatus.OK,
        msg: message,
        data: letting.property_name,
      };
    } else {
      return {
        success: false,
        status: restApiResponseStatus.NotFound,
        msg: "No upcoming tenant expirations within 2 months.",
      };
    }
  }

  async insuranceExpireNotifications(id: bigint): Promise<any> {
    const property = await this.notificationRepo.getuserdetail(id);
    if (!property || property.length === 0) {
      return {
        success: false,
        status: restApiResponseStatus.NotFound,
        msg: "Property not found",
      };
    }
    const documentDetail = await this.notificationRepo.expireInsurance(id);
    const notifications = [];
    let notificationsSent = false;

    for (const val of documentDetail) {
      for (const field of ["insurance_expiry"]) {
        const Title = `${val.address}`;
        const expiryDate = moment(val[field], "DD/MM/YYYY").toDate();
        const daysUntilExpiry = moment(expiryDate).diff(moment(), "days");
        const daysNotificationThreshold = 7;
        const weeklyNotificationThreshold = 3; // Notifications will be sent weekly within 7 days of expiration

        const documentDetail = await this.notificationRepo.getNotifyById(
          val.userId,
          val.propertyId
        );
        if (!documentDetail) {
          if (daysUntilExpiry <= 0) {
            const expiryDateFromNow = moment(
              val[field],
              "DD/MM/YYYY"
            ).fromNow();
            const message = `Your ${field.replace("_", " ")} has Expired on ${
              val[field]
            } (${expiryDateFromNow}).`;
            const response = await this.notificationRepo.notificationSend(
              val.userId,
              val.propertyId,
              Title,
              message
            );
            notifications.push({
              success: true,
              status: restApiResponseStatus.OK,
              msg: message,
              data: response,
            });
            notificationsSent = true;
          } else if (daysUntilExpiry <= daysNotificationThreshold) {
            const message = `Your ${field.replace("_", " ")} is expiring on ${
              val[field]
            } (in ${daysUntilExpiry} days).`;
            const response = await this.notificationRepo.notificationSend(
              val.userId,
              val.propertyId,
              Title,
              message
            );
            notifications.push({
              success: true,
              status: restApiResponseStatus.OK,
              msg: message,
              data: response,
            });
            notificationsSent = true;
          } else if (daysUntilExpiry <= weeklyNotificationThreshold * 7) {
            const weeksUntilExpiry = Math.ceil(daysUntilExpiry / 7);
            const message = `Your ${field.replace("_", " ")} is expiring on ${
              val[field]
            } (in ${weeksUntilExpiry} weeks).`;
            const response = await this.notificationRepo.notificationSend(
              val.userId,
              val.propertyId,
              Title,
              message
            );
            notifications.push({
              success: true,
              status: restApiResponseStatus.OK,
              msg: message,
              data: response,
            });
            notificationsSent = true;
          }
        } else {
          if (daysUntilExpiry <= 0) {
            const expiryDateFromNow = moment(
              val[field],
              "DD/MM/YYYY"
            ).fromNow();
            const message = `Your ${field.replace("_", " ")} has Expired on ${
              val[field]
            } (${expiryDateFromNow}).`;
            const response = await this.notificationRepo.notificationUpdate(
              val.userId,
              val.propertyId,
              Title,
              message
            );
            notifications.push({
              success: true,
              status: restApiResponseStatus.OK,
              msg: message,
              data: response,
            });
            notificationsSent = true;
          } else if (daysUntilExpiry <= daysNotificationThreshold) {
            const message = `Your ${field.replace("_", " ")} is expiring on ${
              val[field]
            } (in ${daysUntilExpiry} days).`;
            const response = await this.notificationRepo.notificationUpdate(
              val.userId,
              val.propertyId,
              Title,
              message
            );
            notifications.push({
              success: true,
              status: restApiResponseStatus.OK,
              msg: message,
              data: response,
            });
            notificationsSent = true;
          } else if (daysUntilExpiry <= weeklyNotificationThreshold * 7) {
            const weeksUntilExpiry = Math.ceil(daysUntilExpiry / 7);
            const message = `Your ${field.replace("_", " ")} is expiring on ${
              val[field]
            } (in ${weeksUntilExpiry} weeks).`;
            const response = await this.notificationRepo.notificationUpdate(
              val.userId,
              val.propertyId,
              Title,
              message
            );
            notifications.push({
              success: true,
              status: restApiResponseStatus.OK,
              msg: message,
              data: response,
            });
            notificationsSent = true;
          }
        }
      }
    }

    if (!notificationsSent) {
      return {
        success: false,
        status: restApiResponseStatus.NotFound,
        msg: "No upcoming insurance expirations within 1 week.",
      };
    }
    return {
      success: true,
      status: restApiResponseStatus.OK,
      msg: "Notification generated successfully",
      data: notifications,
    };
  }

  async documentExpire(id: bigint): Promise<any> {
    const property = await this.notificationRepo.getuserdetail(id);
    if (!property) {
      return {
        success: false,
        status: restApiResponseStatus.NotFound,
        msg: "Property not found",
      };
    }
    const documentDetail = await this.notificationRepo.documentList(id);
    const notifications = [];
    let notificationsSent = false; // Flag to track if any notifications were sent

    for (const val of documentDetail) {
      for (const field of [
        "mortgage_statement_expiry_date",
        "landlord_insurance_expiry_date",
        "tenancy_aggrement_expiry_date",
        "electrical_report_eicr_expiry_date",
        "portable_appliance_testing_expiry_date",
        "energy_performance_epc_expiry_date",
        "term_of_business_expiry_date",
      ]) {
        const Title = `${val.address}`;
        const expiryDate = moment(val[field], "YYYY-MM-DD").toDate();
        const daysUntilExpiry = moment(expiryDate).diff(moment(), "days");
        
        const daysNotificationThreshold = 7;
        const weeklyNotificationThreshold = 3; // Notifications will be sent weekly within 7 days of expiration

        if (daysUntilExpiry === 90) {
          const message = `Your ${field.replace("_", " ")} is expiring on ${
            val[field]
          } (in 90 days).`;
          const existingNotification =
            await this.notificationRepo.getExistingNotification(
              val.userId,
              val.propertyId,
              Title,
              message
            );
          if (existingNotification) {
            await this.notificationRepo.docNotificationUpdate(
              existingNotification.id,
              message
            );
          } else {
            const response = await this.notificationRepo.docNotificationSend(
              val.userId,
              val.propertyId,
              Title,
              message
            );
            notifications.push({
              success: true,
              status: restApiResponseStatus.OK,
              msg: message,
              data: response,
            });
          }
          notificationsSent = true; // Set the flag to true
        }
        if (daysUntilExpiry === 30) {
          const message = `Your ${field.replace("_", " ")} is expiring on ${
            val[field]
          } (in 30 days).`;
          const existingNotification =
            await this.notificationRepo.getExistingNotification(
              val.userId,
              val.propertyId,
              Title,
              message
            );
          if (existingNotification) {
            await this.notificationRepo.docNotificationUpdate(
              existingNotification.id,
              message
            );
          } else {
            const response = await this.notificationRepo.docNotificationSend(
              val.userId,
              val.propertyId,
              Title,
              message
            );
            notifications.push({
              success: true,
              status: restApiResponseStatus.OK,
              msg: message,
              data: response,
            });
          }
          notificationsSent = true; // Set the flag to true
        }

        if (daysUntilExpiry <= 0) {
          const expiryDateFromNow = moment(val[field], "YYYY-MM-DD").fromNow();
          const message = `Your ${field.replace("_", " ")} has Expired on ${
            val[field]
          } (${expiryDateFromNow}).`;
          const existingNotification =
            await this.notificationRepo.getExistingNotification(
              val.userId,
              val.propertyId,
              Title,
              message
            );
          if (existingNotification) {
            await this.notificationRepo.docNotificationUpdate(
              existingNotification.id,
              message
            );
          } else {
            const response = await this.notificationRepo.docNotificationSend(
              val.userId,
              val.propertyId,
              Title,
              message
            );
            notifications.push({
              success: true,
              status: restApiResponseStatus.OK,
              msg: message,
              data: response,
            });
          }
          notificationsSent = true; // Set the flag to true
        } else if (daysUntilExpiry <= daysNotificationThreshold) {
          const message = `Your ${field.replace("_", " ")} is expiring on ${
            val[field]
          } (in ${daysUntilExpiry} days).`;
          const existingNotification =
            await this.notificationRepo.getExistingNotification(
              val.userId,
              val.propertyId,
              Title,
              message
            );
          if (existingNotification) {
            await this.notificationRepo.docNotificationUpdate(
              existingNotification.id,
              message
            );
          } else {
            const response = await this.notificationRepo.docNotificationSend(
              val.userId,
              val.propertyId,
              Title,
              message
            );
            notifications.push({
              success: true,
              status: restApiResponseStatus.OK,
              msg: message,
              data: response,
            });
          }
          notificationsSent = true; // Set the flag to true
        } else if (daysUntilExpiry <= weeklyNotificationThreshold * 7) {
          const weeksUntilExpiry = Math.ceil(daysUntilExpiry / 7);
          const message = `Your ${field.replace("_", " ")} is expiring on ${
            val[field]
          } (in ${weeksUntilExpiry} weeks).`;
          const existingNotification =
            await this.notificationRepo.getExistingNotification(
              val.userId,
              val.propertyId,
              Title,
              message
            );
          if (existingNotification) {
            await this.notificationRepo.docNotificationUpdate(
              existingNotification.id,
              message
            );
          } else {
            const response = await this.notificationRepo.docNotificationSend(
              val.userId,
              val.propertyId,
              Title,
              message
            );
            notifications.push({
              success: true,
              status: restApiResponseStatus.OK,
              msg: message,
              data: response,
            });
          }
          notificationsSent = true; // Set the flag to true
        }
      }
    }
    if (!notificationsSent) {
      return {
        success: false,
        status: restApiResponseStatus.NotFound,
        msg: "No upcoming insurance expirations within 1 week.",
      };
    }
    return {
      success: true,
      status: restApiResponseStatus.OK,
      msg: "Notification generated successfully",
      data: notifications,
    };
  }

  async clearDocNotifications(id: bigint): Promise<NotificationPropertys> {
    const notification = await this.notificationRepo.clearDocNotification(id);
    if (!notification) {
      return {
        success: false,
        status: restApiResponseStatus.BadRequest,
        msg: "Notifications not clear",
      };
    }
    return {
      success: true,
      status: restApiResponseStatus.OK,
      msg: "Notifications clear successfully",
      data: { notification },
    };
  }

  async seenDocNotifications(
    id: bigint,
    data: NotificationType
  ): Promise<NotificationPropertys> {
    const notification = await this.notificationRepo.seenDocNotification(
      id,
      data.id
    );
    if (!notification) {
      return {
        success: false,
        status: restApiResponseStatus.BadRequest,
        msg: appErrorMessage.DATANOTFOUND,
      };
    }
    const notifications = await this.notificationRepo.seenDocNotifications(
      notification.id
    );
    if (!notifications) {
      return {
        success: false,
        status: restApiResponseStatus.BadRequest,
        msg: appErrorMessage.DATANOTFOUND,
      };
    }
    return {
      success: true,
      status: restApiResponseStatus.OK,
      msg: "Notifications seen succefully",
      data: { notifications },
    };
  }
}
