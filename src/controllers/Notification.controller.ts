import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";
import { NotificationRepo } from "../repository/notification.repo";
import { PropertyRepo } from "../repository/property.repo";

const notificationController = new NotificationService(new NotificationRepo(), new PropertyRepo());

export class NotificationController {
    constructor() { }

    async notification(req: Request, res: Response) {
        const id = req.body?.user?.id;
        const arg = await notificationController.allNotifications(id);
        return res.status(arg.status).json(arg);
    }

    async count(req: Request, res: Response) {
        const id = req.body?.user?.id;
        const arg = await notificationController.countNotifications(id);
        return res.status(arg.status).json(arg);
    }

    async notify(req: Request, res: Response) {
        const id = req.body?.user?.id;
        const arg = await notificationController.clearNotifications(id);
        return res.status(arg.status).json(arg);
    }

    async seen(req: Request, res: Response) {
        const id = req.body?.user?.id;
        const arg = await notificationController.seenNotifications(id, req.body);
        return res.status(arg.status).json(arg);
    }
    async tenantExpire(req: Request, res: Response) {
        const id = req.body?.user?.id;
        const arg = await notificationController.tenantExpireNotifications(id);
        return res.status(arg.status).json(arg);
    }
    async insuranceExpire(req: Request, res: Response) {
        const id = req.body?.user?.id;
        const arg = await notificationController.insuranceExpireNotifications(id);
        return res.status(arg.status).json(arg);
    }

    async documentExpire(req: Request, res: Response) {
        const id = req.body?.user?.id;
        const arg = await notificationController.documentExpire(id);
        return res.status(arg.status).json(arg);
    }

    async notifications(req: Request, res: Response) {
        const id = req.body?.user?.id;
        const arg = await notificationController.docsNotifications(id);
        return res.status(arg.status).json(arg);
    }


    async DocNotify(req: Request, res: Response) {
        const id = req.body?.user?.id;
        const arg = await notificationController.clearDocNotifications(id);
        return res.status(arg.status).json(arg);
    }

    async DocSeen(req: Request, res: Response) {
        const id = req.body?.user?.id;
        const arg = await notificationController.seenDocNotifications(id, req.body);
        return res.status(arg.status).json(arg);
    }
}