import sendPropertyMail from "../utils/sendEmailRaiseIssue";
import { AdminRepo } from "../repository/admin.repo";
import { PropertyRepo } from "../repository/property.repo";
import {
  PropertyListRes,
  UserEdit,
  UserRegister,
  UserRes,
} from "../types/type";
import { appErrorMessage } from "../utils/appErrorMessage";
import JWTRedis from "../utils/auth.jwt";
import { restApiResponseStatus } from "../utils/restApiResponseStatus";
const jwt = new JWTRedis();

export class AdminService {
  constructor(
    private readonly adminRepo: AdminRepo,
    private readonly propertyRepo: PropertyRepo
  ) {}

  async userAdd(body: UserRegister): Promise<UserRes> {
    const userDetails = await this.adminRepo.getUserDataByEmail(body);
    if (!userDetails) {
      const userRegister = await this.adminRepo.register(body);
      if (!userRegister) {
        return {
          success: false,
          status: restApiResponseStatus.BadRequest,
          msg: "User not add.",
        };
      }
      const tokenInfo = await jwt.createToken(userRegister);
      return {
        success: true,
        status: restApiResponseStatus.OK,
        msg: "User successfully add.",
        data: userRegister,
        tokenInfo,
      };
    }
    return {
      success: true,
      status: restApiResponseStatus.OK,
      msg: "User already exist.",
    };
  }

  async userEdit(id: number, body: UserEdit): Promise<UserRes> {
    const detailEdit = await this.adminRepo.updateUser(id, body);
    delete detailEdit?.password;
    if (!detailEdit) {
      return {
        success: false,
        status: restApiResponseStatus.NotFound,
        msg: "User data not update",
      };
    }
    return {
      success: true,
      status: restApiResponseStatus.OK,
      msg: "User Detail update successfully.",
      data: detailEdit,
    };
  }

  async propertyList(): Promise<PropertyListRes> {
    const property = await this.adminRepo.propertyList();
    if (!property) {
      return {
        success: false,
        status: restApiResponseStatus.BadRequest,
        msg: "something wrong property",
      };
    }
    const data = property.map((value: string) => {
      return {
        userId: value["userId"],
        property_id: value["id"],
        property_name: value["property_name"],
        property_address: value["address"],
        mortgage_expiry: value["mortgage_expiry"],
        Property_value: value["property_estimate"],
        Monthly_net_income:
          value["gross_monthly_income"] -
          value["mortgage_payment"] -
          value["ground_rent"] -
          value["management_fee"] -
          value["service_charge"],
        Net_equity: value["property_estimate"] - value["debt"],
        Debt: value["debt"],
        Roi:
          (((value["gross_monthly_income"] -
            value["mortgage_payment"] -
            value["ground_rent"] -
            value["management_fee"] -
            value["service_charge"]) *
            12) /
            (value["property_estimate"] - value["debt"])) *
          100,
      };
    });
    return {
      success: true,
      status: restApiResponseStatus.OK,
      msg: "Get all property list.",
      data: data,
    };
  }

  async propertyDelete(id: number): Promise<UserRes> {
    const userDetails = await this.adminRepo.findByPropertyId(id);
    if (userDetails === 1) {
      return {
        success: true,
        status: restApiResponseStatus.OK,
        msg: "Property delete successfully .",
      };
    }
    return {
      success: false,
      status: restApiResponseStatus.NotFound,
      msg: appErrorMessage.DATANOTFOUND,
    };
  }

  async filterUsers(name: string): Promise<UserRes> {
    const userDetails = await this.adminRepo.filterUsers(name);
    if (!userDetails) {
      return {
        success: false,
        status: restApiResponseStatus.NotFound,
        msg: appErrorMessage.DATANOTFOUND,
      };
    }
    return {
      success: true,
      status: restApiResponseStatus.OK,
      data: userDetails,
      msg: "users with their property.",
    };
  }

  async raisePropertyMail(data: any): Promise<UserRes> {
    const subject = `Property Valuation Issue for postcode ${data.postcode}`;
    const info = { full_name: data.full_name, postcode: data.postcode };
    await sendPropertyMail(subject, info);
    return {
      success: true,
      status: restApiResponseStatus.OK,
      msg: "Request send to admin for this property.",
    };
  }
}
