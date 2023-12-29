import { Express } from "express";
import { AuthController } from "../controllers/Auth.controllers";
import validate from "../requests/user.request";
const user = new AuthController();

export function AuthUserRoutes(app: Express) {
  app.post("/api/register", validate("register"), user.register);
  app.post("/api/login", validate("login"), user.login);
  app.post("/api/changepassword", validate("changePassword"), user.changePassword);
  app.post("/api/forgotpassword", validate("forgot"), user.forgotPassword);
  app.post("/api/verifyotp", validate("verifyOtp"), user.verifyOtp);
  app.post("/api/resetpassword", validate("reset"), user.resetPassword);
  app.post("/api/resendotp", validate("forgot"), user.resendotp);
  app.post("/api/socialLogin", validate("socialLogin"), user.socialLogin);

}

