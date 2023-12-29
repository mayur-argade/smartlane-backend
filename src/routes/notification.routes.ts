import { Express } from "express";
import { NotificationController } from "../controllers/Notification.controller";
import validToken from "../middleware/auth.jwt.middleware"

const notify = new NotificationController();

export function notificationRoutes(app: Express) {
    app.get("/api/getNotificationList", validToken, notify.notification);
    app.put("/api/clearNotification", validToken, notify.notify);
    app.get("/api/countNotification", validToken, notify.count);
    app.put("/api/seenNotification", validToken, notify.seen);
    app.post("/api/expireTenant", validToken, notify.tenantExpire);
    app.post("/api/expireInsurance", validToken, notify.insuranceExpire);
    app.post("/api/docExpire", validToken, notify.documentExpire);
    app.get("/api/getDocNotificationList", validToken, notify.notifications);
    app.put("/api/seenDocNotification", validToken, notify.DocSeen);
    app.put("/api/clearDocNotification", validToken, notify.DocNotify);

}

