import { VerificationRepo } from "../repository/verification.repo";
import { UserRepo } from "../repository/user.repo";
import {
  ChangePassword,
  Login,
  Otp,
  ResetPassword,
  SocialLogin,
  UserRegister,
  UserRes,
} from "../types/type";
import { appErrorMessage } from "../utils/appErrorMessage";
import JWTRedis from "../utils/auth.jwt";
import { createOTP } from "../utils/createOtp";
import { restApiResponseStatus } from "../utils/restApiResponseStatus";
import sendEmail from "../utils/sendEmail";
import { PasswordUtil } from "../utils/utils.bcrypt";
const jwt = new JWTRedis();

export class AuthService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly verificationRepo: VerificationRepo
  ) { }

  async register(body: UserRegister): Promise<UserRes> {
    const subject = "smartlane signup OTP ";
    const userDetails = await this.userRepo.getUserDataByEmail(body.email);
    if (!userDetails) {
      const userRegister = await this.userRepo.register(body);
      if (!userRegister) {
        console.log("userdatanot reg")
        return {
          success: false,
          status: restApiResponseStatus.BadRequest,
          msg: "User not register",
        };
        
      }
    
      const code = createOTP();
      // const code = 1234;
      const generateCode = await this.verificationRepo.forgotPassword(code, userRegister.id);
      if (!generateCode) {
        console.log("generateCode falil")
        return {
          success: false,
          status: restApiResponseStatus.BadRequest,
          msg: "OTP not generated",
        };
      }
      const tokenInfo = await jwt.createToken(userRegister);
      await sendEmail(body.email, subject, code);
      console.log("sendEmailCall")
      return {
        success: true,
        status: restApiResponseStatus.OK,
        msg: "Otp sent successfully on your email.",
        data: userRegister,
        tokenInfo,
      };
    }
    if (userDetails.status === '1') {
      return {
        success: false,
        status: restApiResponseStatus.Conflict,
        msg: appErrorMessage.EMAILALREADYEXISTS,
      };
    }
    if (userDetails.status === '0') {
      const userRegister = await this.userRepo.updateRegister(body);
      delete userRegister?.password;
      if (!userRegister) {
        return {
          success: false,
          status: restApiResponseStatus.BadRequest,
          msg: "User not update",
        };
      }
      const detailUpdate = await this.userRepo.getUserDataByEmail(body.email);

      const code = createOTP();
      // const code = 1234;
      const generateCode = await this.verificationRepo.forgotPassword(code, detailUpdate.id);
      if (!generateCode) {
        return {
          success: false,
          status: restApiResponseStatus.BadRequest,
          msg: "OTP not generated",
        };
      }
      const tokenInfo = await jwt.createToken(userDetails);
      await sendEmail(body.email, subject, code);
      return {
        success: true,
        status: restApiResponseStatus.OK,
        msg: "Otp sent successfully on your email.",
        data: detailUpdate,
        tokenInfo,
      };
    }

  }

  async logIn(body: Login): Promise<UserRes> {
    const { email, password } = body;
    const userDetails = await this.userRepo.getUserDataByEmail(email);
    if (!userDetails) {
      return {
        success: false,
        status: restApiResponseStatus.NotFound,
        msg: appErrorMessage.EMAILDOESNOTEXISTS,
      };
    }
    const userType = await this.userRepo.getUserTypeByLogin(email);
    if (!userType) {
      return {
        success: false,
        status: restApiResponseStatus.NotFound,
        msg: appErrorMessage.INVALIDUSERTYPE,
      };
    }
    const verifystatus = await this.userRepo.getVerificationStatus(
      userDetails.email,
      '1'
    );
    if (!verifystatus) {
      return {
        success: false,
        status: restApiResponseStatus.NotFound,
        msg: "User not verify",
      };
    }

    const passwordUtil = new PasswordUtil(password);
    const passwordIsValid = passwordUtil.compareHash(userDetails.password);
    if (!passwordIsValid) {
      return {
        success: false,
        status: restApiResponseStatus.Unauthorized,
        msg: appErrorMessage.INVALIDPASSWORD,
      };
    } else {
      const tokenInfo = await jwt.createToken(userDetails);
      return {
        success: true,
        status: restApiResponseStatus.Authorized,
        msg: " Login successfully",
        data: userDetails,
        tokenInfo,
      };
    }
  }

  async changePassword(credentials: ChangePassword): Promise<UserRes> {
    const { email, old_password, new_password } = credentials;
    const userDetails = await this.userRepo.getUserDataByEmail(email);
    if (!userDetails) {
      return {
        success: false,
        status: restApiResponseStatus.NotFound,
        msg: appErrorMessage.EMAILDOESNOTEXISTS,
      };
    }
    const passwordUtil = new PasswordUtil(old_password);
    const passwordIsValid = passwordUtil.compareHash(userDetails.password);
    if (passwordIsValid) {
      const passwordUtil = new PasswordUtil(new_password);
      const update_password = passwordUtil.getHash();
      const UpdatePassword = await this.userRepo.UpdatePassword(
        email,
        update_password
      );
      if (!UpdatePassword.length) {
        return {
          success: false,
          status: restApiResponseStatus.BadRequest,
          msg: appErrorMessage.DATANOTFOUND,
        };
      }
      return {
        success: true,
        status: restApiResponseStatus.OK,
        msg: "Password update successfully.",
      };
    } else {
      return {
        success: false,
        status: restApiResponseStatus.Conflict,
        msg: appErrorMessage.OLDPASSWORDDOSENOTMATCH,
      };
    }
  }

  async forgotPassword(email: string): Promise<UserRes> {
    const userDetails = await this.userRepo.getUserDataByEmail(email);
    if (!userDetails) {
      return {
        success: false,
        status: restApiResponseStatus.NotFound,
        msg: appErrorMessage.EMAILDOESNOTEXISTS,
      };
    }
    const code = createOTP();
    // const code = 1234;
    const subject = "smartlane password reset";
    const generateCode = await this.verificationRepo.forgotPassword(
      code,
      userDetails.id
    );
    if (!generateCode) {
      return {
        success: false,
        status: restApiResponseStatus.BadRequest,
        msg: "OTP not generated",
      };
    }
    await sendEmail(email, subject, code);
    return {
      success: true,
      status: restApiResponseStatus.OK,
      msg: "We have sent an otp on your email.",
    };
  }

  async verifyOtp(info: Otp): Promise<UserRes> {
    const userDetails = await this.userRepo.getUserDataByEmail(info.email);
    if (!userDetails) {
      return {
        success: false,
        status: restApiResponseStatus.NotFound,
        msg: appErrorMessage.EMAILDOESNOTEXISTS,
      };
    }
    const verifictaionDetail =
      await this.verificationRepo.getVerificationDetailByUserId(
        userDetails.id,
        info.code,
        '0'
      );
    if (!verifictaionDetail) {
      return {
        success: false,
        status: restApiResponseStatus.NotFound,
        msg: appErrorMessage.CODENOTMATCHED,
      };
    }
    const Updateverification = await this.verificationRepo.UpdateStatus(
      userDetails.id,
      '1'
    );
    if (!Updateverification.length) {
      return {
        success: false,
        status: restApiResponseStatus.BadRequest,
        msg: appErrorMessage.DATANOTFOUND,
      };
    }
    await this.userRepo.UpdateStatuslogin(
      userDetails.email
    );

    return {
      success: true,
      status: restApiResponseStatus.OK,
      msg: "Great! You have enter correct OTP.",
    };
  }

  async resetPassword(data: ResetPassword): Promise<UserRes> {
    const { email, code, new_password } = data;
    const userDetails = await this.userRepo.getUserDataByEmail(email);
    if (!userDetails) {
      return {
        success: false,
        status: restApiResponseStatus.NotFound,
        msg: appErrorMessage.EMAILDOESNOTEXISTS,
      };
    }
    const VerificationDetails = await this.verificationRepo.getVerificationDetailByUserId(
      userDetails.id,
      code,
      '1'
    );
    if (!VerificationDetails) {
      return {
        success: false,
        status: restApiResponseStatus.NotFound,
        msg: appErrorMessage.CODENOTMATCHED,
      };
    }
    const passwordUtil = new PasswordUtil(new_password);
    const password = passwordUtil.getHash();
    const UpdatePassword = await this.userRepo.UpdatePassword(email, password);
    if (!UpdatePassword.length) {
      return {
        success: false,
        status: restApiResponseStatus.BadRequest,
        msg: appErrorMessage.DATANOTFOUND,
      };
    }
    const Updateverification = await this.verificationRepo.UpdateStatus(
      userDetails.id,
      '2'
    );
    if (!Updateverification.length) {
      return {
        success: false,
        status: restApiResponseStatus.BadRequest,
        msg: appErrorMessage.DATANOTFOUND,
      };
    }
    return {
      success: true,
      status: restApiResponseStatus.OK,
      msg: "Password reset successfully.",
    };

  }

  async resendOtp(email: string): Promise<UserRes> {
    const userDetails = await this.userRepo.getUserDataByEmail(email);
    if (!userDetails) {
      return {
        success: false,
        status: restApiResponseStatus.NotFound,
        msg: appErrorMessage.EMAILDOESNOTEXISTS,
      };
    }
    const code = createOTP();
    // const code = 1234;
    const subject = "Your OTP"
    await this.verificationRepo.forgotPassword(
      code,
      userDetails.id
    );

    await sendEmail(email, subject, code);
    return {
      success: true,
      status: restApiResponseStatus.OK,
      msg: "We have sent an registration otp on your email.",
    };
  }

  async socialLogin(body: SocialLogin): Promise<UserRes> {
    const { social_loginId, user_type, full_name, email } = body;
    const userDetails = await this.userRepo.getSocialloginByEmail(social_loginId, email);
    if (!userDetails) {
      const newUser = {
        social_loginId,
        user_type,
        full_name,
        email,
      };
      const userType = await this.userRepo.socialRegister(newUser);
      if (!userType) {
        return {
          success: false,
          status: restApiResponseStatus.BadRequest,
          msg: "User not register",
        };
      }
    }
    const user = await this.userRepo.getSocialloginByEmail(social_loginId, email);
    const tokenInfo = await jwt.createToken(user);
    return {
      success: true,
      status: restApiResponseStatus.Authorized,
      msg: "Social Login successfully",
      data: user,
      tokenInfo,
    };
  }

}
