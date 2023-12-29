import { AuthUser } from "../models/authuser.seq.model";
import { SocialLogin, UserRegister } from "../types/type";
import { PasswordUtil } from "../utils/utils.bcrypt";
import { Op } from "sequelize";

export class UserRepo {
  async getUserDataByEmail(email: string) {
    return new Promise<UserRegister>((res, rej) => {
      AuthUser.findOne({
        where: { email },
      })
        .then((user: UserRegister) => {
          res(user);
        })
        .catch((err) => {
          rej(err);
        });
    });
  }

  async UpdateStatuslogin(email: string) {
    return new Promise<number[]>((res, rej) => {
      AuthUser.update({ status: '1' }, { where: { email } })
        .then((data) => {
          res(data);
        })
        .catch((err) => {
          rej(err);
        });
    });
  }

  async register(user: UserRegister) {
    return new Promise<UserRegister>((res, rej) => {
      const passwordUtil = new PasswordUtil(user.password);
      user.password = passwordUtil.getHash();
      AuthUser.create({
        email: user.email,
        full_name: user.full_name,
        password: user.password,
        user_type: user.user_type,
      })
        .then((data) => {
          res(data);
        })
        .catch((err) => {
          rej(err);
        });
    });
  }

  async updateRegister(user: UserRegister) {
    return new Promise<any>((res, rej) => {
      const passwordUtil = new PasswordUtil(user.password);
      user.password = passwordUtil.getHash();
      AuthUser.update({
        email: user.email,
        full_name: user.full_name,
        password: user.password,
        user_type: user.user_type,
      }, { where: { email: user.email } })
        .then((data) => {
          res(data);
        })
        .catch((err) => {
          rej(err);
        });
    });
  }

  async UpdatePassword(email: string, password: string) {
    return new Promise<number[]>((res, rej) => {
      AuthUser.update({ password }, { where: { email } })
        .then((data) => {
          res(data);
        })
        .catch((err) => {
          rej(err);
        });
    });
  }

  async getVerificationStatus(email: string, status: string) {
    return new Promise<UserRegister>((res, rej) => {
      AuthUser.findOne({
        where: { [Op.and]: [{ email }, { status }] },
      })
        .then((data: UserRegister) => {
          res(data);
        })
        .catch((err) => {
          rej(err);
        });
    });
  }

  async getUserTypeByLogin(email: string) {
    return new Promise<UserRegister>((res, rej) => {
      AuthUser.findOne({
        where: { email },
      })
        .then((user: UserRegister) => {
          res(user);
        })
        .catch((err) => {
          rej(err);
        });
    });
  }

  async getSocialloginByEmail(social_loginId: any, email: string) {
    return new Promise<UserRegister>((res, rej) => {
      AuthUser.findOne({
        where: { [Op.and]: [{ social_loginId }, { email }] },
      })
        .then((user: UserRegister) => {
          res(user);
        })
        .catch((err) => {
          rej(err);
        });
    });
  }

  async socialRegister(user: SocialLogin) {
    return new Promise<SocialLogin>((res, rej) => {
      AuthUser.create({
        email: user.email,
        full_name: user.full_name,
        social_loginId: user.social_loginId,
        user_type: user.user_type,
        status: "1",
      })
        .then((data) => {
          res(data);
        })
        .catch((err) => {
          rej(err);
        });
    });
  }

}
