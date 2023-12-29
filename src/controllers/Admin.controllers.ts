import { Request, Response } from "express";
import { AdminService } from "../services/admin.service";
import { AdminRepo } from "../repository/admin.repo";
import { PropertyRepo } from "../repository/property.repo";

const adminService = new AdminService(new AdminRepo(), new PropertyRepo());

export class AdminController {
    constructor() {}
    async userAdd(req: Request, res: Response) {
        const arg = await adminService.userAdd(req.body);
        return res.status(arg.status).json(arg);
    }

    async userEdit(req: Request, res: Response) {
        const id = req.body.id
        const arg = await adminService.userEdit(id, req.body);
        return res.status(arg.status).json(arg);
    }

    async propertyList(req: Request, res: Response) {
        const arg = await adminService.propertyList();
        return res.status(arg.status).json(arg);
    }

    async delete(req: Request, res: Response) {
        const arg = await adminService.propertyDelete(req.body.id);
        return res.status(arg.status).json(arg);
    }

    async filterUsers(req: Request, res: Response) {
        const arg = await adminService.filterUsers(req.body.name);
        return res.status(arg.status).json(arg);
    }

    async raisePropertyMail(req: Request, res: Response) {
        const arg = await adminService.raisePropertyMail(req.body);
        return res.status(arg.status).json(arg);
    }
}
