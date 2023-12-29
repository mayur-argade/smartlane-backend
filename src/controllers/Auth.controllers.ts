import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AuthService } from "../services/auth.service";
import { UserRepo } from "../repository/user.repo";
import { VerificationRepo } from "../repository/verification.repo";
const authService = new AuthService(new UserRepo(), new VerificationRepo());

export class AuthController {
  constructor() { }
  async register(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const arg = await authService.register(req.body);
    return res.status(arg.status).json(arg);
  }

  async login(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const arg = await authService.logIn(req.body);
    return res.status(arg.status).json(arg);
  }

  async changePassword(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const arg = await authService.changePassword(req.body);
    return res.status(arg.status).json(arg);
  }

  async forgotPassword(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const arg = await authService.forgotPassword(req.body.email);
    return res.status(arg.status).json(arg);
  }

  async verifyOtp(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const arg = await authService.verifyOtp(req.body);
    return res.status(arg.status).json(arg);
  }

  async resetPassword(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const arg = await authService.resetPassword(req.body);
    return res.status(arg.status).json(arg);
  }

  async resendotp(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const arg = await authService.resendOtp(req.body.email);
    return res.status(arg.status).json(arg);
  }

  async socialLogin(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const arg = await authService.socialLogin(req.body);
    return res.status(arg.status).json(arg);
  }

}
