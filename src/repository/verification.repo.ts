import { Op } from "sequelize";
import { VerificationCode } from "../models/verificationCode.seq.model";
import { VerificationDetail } from "../types/type";
import moment from "../utils/moment";

export class VerificationRepo {

  async getVerificationDetailByUserId(user_id: bigint, code: string, status: string) {
    return new Promise<VerificationDetail>((res, rej) => {
      VerificationCode.findOne({
        where: { [Op.and]: [{ user_id }, { code }, { status }] },
      })
        .then((data: VerificationDetail) => {
          res(data);
        })
        .catch((err) => {
          rej(err);
        });
    });
  }

  async forgotPassword(code: number, userId: bigint) {
    const OtpExpirationDate = moment();
    return new Promise<boolean>((res, rej) => {
      // const code = 1234;
      VerificationCode.upsert({
        code: code,
        user_id: userId,
        OtpExpirationDate: OtpExpirationDate,
        status: '0'
      })
        .then((data) => {
          res(data[1]);
        })
        .catch((err) => {
          rej(err);
        });
    });
  }

  async UpdateStatus(user_id: bigint, status: string) {
    return new Promise<number[]>((res, rej) => {
      VerificationCode.update({ status }, { where: { user_id } })
        .then((data) => {
          res(data);
        })
        .catch((err) => {
          rej(err);
        });
    });
  }

}