import { PropertyRepo } from "../repository/property.repo";
import { UserRepo } from "../repository/user.repo";
import {
    AddProperty,
    PropertyRes,
    PostCode,
    PostCodeRes,
    ValuationData,
    PropertyListRes,
    PropertyDetail,
    EditProperty,
    EditPropertys,
} from "../types/type";
import { appErrorMessage } from "../utils/appErrorMessage";
import { restApiResponseStatus } from "../utils/restApiResponseStatus";
import appConfig from "../config/app.config";
import moment = require("moment");

export class PropertyService {
    constructor(
        private readonly propertyRepo: PropertyRepo,
        private readonly userRepo: UserRepo
    ) { }

    async addProperty(id: bigint, data: AddProperty): Promise<PropertyRes> {
      
        const properyDetails = await this.propertyRepo.getProertyDetailById(
            id,
            data.property
        );
        console.log("functioncall addproperty" ,  data )
        if (properyDetails.length === 0) {
            const property = await this.propertyRepo.addProperty(id, data.property);
            if (!property) {
                return {
                    success: false,
                    status: restApiResponseStatus.BadRequest,
                    msg: "something wrong property",
                };
            }
            const roi = await this.propertyRepo.addRoi(property.id, data.roi,data.property.property_estimate);
            
            if (!roi) {
                return {
                    success: false,
                    status: restApiResponseStatus.BadRequest,
                    msg: "something wrong roi",
                };
            }
            const ownership = await this.propertyRepo.addOwnership(
                property.id,
                data.ownership
            );
            if (!ownership) {
                return {
                    success: false,
                    status: restApiResponseStatus.BadRequest,
                    msg: "something wrong ownership",
                };
            }
            const insurance = await this.propertyRepo.addInsurance(
                property.id,
                data.insurance
            );
            if (!insurance) {
                return {
                    success: false,
                    status: restApiResponseStatus.BadRequest,
                    msg: "something wrong insurance",
                };
            }
            const mortgage = await this.propertyRepo.addMortgage(
                property.id,
                data.mortgage
            );
            if (!mortgage) {
                return {
                    success: false,
                    status: restApiResponseStatus.BadRequest,
                    msg: "something wrong mortgage",
                };
            }
            const letting = await this.propertyRepo.addLetting(
                property.id,
                data.letting
            );
            if (!letting) {
                return {
                    success: false,
                    status: restApiResponseStatus.BadRequest,
                    msg: "something wrong letting",
                };
            }
            return {
                success: true,
                status: restApiResponseStatus.OK,
                msg: "Property Added successfully.",
                data: { property, roi, ownership, insurance, mortgage, letting },
            };
        } else {
            return {
                success: false,
                status: restApiResponseStatus.OK,
                msg: appErrorMessage.DATAALLREADYEXITS,
            };
        }
    }

    async postCode(data: PostCode): Promise<PostCodeRes> {
        const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `https://api.ideal-postcodes.co.uk/v1/postcodes/${data.postcode}?api_key=${appConfig.APIKEY}`,
            headers: {
                Accept: "application/json",
            },
        };
        const property = await this.propertyRepo.searchPostcode(config);
        
        if (!property) {
            return {
                success: false,
                status: restApiResponseStatus.BadRequest,
                msg: "something wrong property",
            };
        }
        return {
            success: true,
            status: restApiResponseStatus.OK,
            msg: "Property list according to postcode",
            data: property,
        }; 
    }

    async propertiesList(id: bigint): Promise<PropertyListRes> {
        const property = await this.propertyRepo.propertyList(id);
        console.log("proprty" , property)
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
                property_estimate: value["property_estimate"],
                Monthly_net_income: value["monthly_net_income"],
                Net_equity: value["property_estimate"] - value["debt"],
                Debt: value["debt"],
                Roi: ((value["monthly_net_income"] * 12) / (value["property_estimate"] - value["debt"])) * 100
                
            };
        });
        return {
            success: true,
            status: restApiResponseStatus.OK,
            msg: "property list.",
            data: data,
        };
    }

    async sendPortfolio(id: bigint): Promise<PropertyListRes> {
        const property = await this.propertyRepo.propertyList(id);
        if (!property) {
            return {
                success: false,
                status: restApiResponseStatus.NotFound,
                msg: "Property portfolio list not found",
            };
        }
        const data = property.map((value: string) => {
            return {
                property_id: value["id"],
                property_name: value["property_name"],
                property_address: value["address"],
                property_estimate: value["property_estimate"],
                property_margin: value["property_margin"],
                previous_estimate: value["previous_estimate"],
                previous_margin: value["previous_margin"],
                roi_gross_monthly_income: value["gross_monthly_income"],
                roi_previous_monthly_net_income: value["previous_monthly_net_income"],
                roi_mortgage_payment: value["mortgage_payment"],
                roi_management_fee: value["management_fee"],
                roi_ground_rent: value["ground_rent"],
                roi_service_charge: value["service_charge"],
                mortgage_debt: value["debt"],
                mortgage_expiry: value["mortgage_expiry"],
                mortgage_type: value["mortgage_type"],
                mortgage_interest: value["interest_rate"],
                mortgage_provider: value["mortgage_provider"],
                ownership_company_number: value["company_number"],
                ownership_type: value["ownership_type"],
                ownership_property_type: value["property_type"],
                ownership_construction_date: value["construction_date"],
                ownership_no_of_bedroom: value["no_of_bedroom"],
                ownership_no_of_bathroom: value["no_of_bathroom"],
                ownership_finish_quality: value["finish_quality"],
                ownership_outdoor_space: value["outdoor_space"],
                ownership_off_street_parking: value["off_street_parking"],
                ownership_internal_area: value["internal_area"],
                insurance_provider: value["insurance_provider"],
                insurance_type: value["insurance_type"],
                insurance_expiry: value["insurance_expiry"],
                Property_value: value["property_estimate"],
                Monthly_net_income: value["monthly_net_income"]
            };
        });
        return {
            success: true,
            status: restApiResponseStatus.OK,
            msg: "Get all portfolio list.",
            data: data,
        };
    }

    async portfolio(id: bigint): Promise<PropertyListRes> {
        const property = await this.propertyRepo.propertyList(id);
        if (!property) {
            return {
                success: false,
                status: restApiResponseStatus.BadRequest,
                msg: "something wrong property",
            };
        }
        const data = property.map((value: string) => {
            return {
                Property_value: value["property_estimate"],
                Monthly_net_income: value["monthly_net_income"],
                Net_equity: value["property_estimate"] - value["debt"],
                Debt: value["debt"],
                Roi: ((value["monthly_net_income"] * 12) / (value["property_estimate"] - value["debt"])) * 100
            };
        });
        const mergeValues = (data: any) => {
            const results = {};
            data.forEach((basket: any) => {
                for (let [key, value] of Object.entries(basket)) {
                    if (results[key]) {
                        results[key] += value;
                    } else {
                        results[key] = value;
                    }
                }
            });
            return results;
        };
        const portfolio: any = mergeValues(data);
        portfolio.length = data.length;
        return {
            success: true,
            status: restApiResponseStatus.OK,
            msg: "property portfolio calculation.",
            data: portfolio,
        };
    }

    async propertyDetail(
        id: bigint,
        info: PropertyDetail
    ): Promise<PropertyListRes> {
        const property = await this.propertyRepo.propertyDetail(id, info.id);
        if (!property) {
            return {
                success: false,
                status: restApiResponseStatus.BadRequest,
                msg: "Property ID not exist",
            };
        }
        return {
            success: true,
            status: restApiResponseStatus.OK,
            msg: "property details.",
            data: property,
        };
    }

    async documentUpload(
        id: bigint,
        info: any,
        mortgageFile: string,
        tenancyFile: string,
        landlordInsuranceFile: string,
        electricalReportFile: string,
        portableApplianceTestingFile: string,
        energyPerformanceFile: string,
        termOfBusinessFile: string
    ): Promise<PropertyListRes> {

        const propertyDetails = await this.propertyRepo.getPropertyIdEdit(id, info.property_id);
        if (propertyDetails) {
            const docDetails = await this.propertyRepo.getDocumentById(id, info.property_id);
            if (!docDetails) {
                const Date = {
                    mortgage_statement_expiry_date: info?.mortgage_statement_expiry_date,
                    tenancy_aggrement_expiry_date: info?.tenancy_aggrement_expiry_date,
                    electrical_report_eicr_expiry_date: info?.electrical_report_eicr_expiry_date,
                    landlord_insurance_expiry_date: info?.landlord_insurance_expiry_date,
                    portable_appliance_testing_expiry_date: info?.portable_appliance_testing_expiry_date,
                    energy_performance_epc_expiry_date: info?.energy_performance_epc_expiry_date,
                    term_of_business_expiry_date: info?.term_of_business_expiry_date
                }
                const document = await this.propertyRepo.documentUpload(
                    id,
                    info.property_id,
                    mortgageFile,
                    Date.mortgage_statement_expiry_date,
                    tenancyFile,
                    Date.tenancy_aggrement_expiry_date,
                    landlordInsuranceFile,
                    Date.landlord_insurance_expiry_date,
                    electricalReportFile,
                    Date.electrical_report_eicr_expiry_date,
                    portableApplianceTestingFile,
                    Date.portable_appliance_testing_expiry_date,
                    energyPerformanceFile,
                    Date.energy_performance_epc_expiry_date,
                    termOfBusinessFile,
                    Date.term_of_business_expiry_date
                );
                return {
                    success: true,
                    status: restApiResponseStatus.OK,
                    msg: "Files uploaded successfully",
                    info: document,
                };
            } else {
                const expiry_date = {
                    mortgage_statement_expiry_date: info?.mortgage_statement_expiry_date,
                    tenancy_aggrement_expiry_date: info?.tenancy_aggrement_expiry_date,
                    electrical_report_eicr_expiry_date: info?.electrical_report_eicr_expiry_date,
                    landlord_insurance_expiry_date: info?.landlord_insurance_expiry_date,
                    portable_appliance_testing_expiry_date: info?.portable_appliance_testing_expiry_date,
                    energy_performance_epc_expiry_date: info?.energy_performance_epc_expiry_date,
                    term_of_business_expiry_date: info?.term_of_business_expiry_date
                }
                const document = await this.propertyRepo.editDocument(
                    id,
                    expiry_date.mortgage_statement_expiry_date,
                    expiry_date.tenancy_aggrement_expiry_date,
                    expiry_date.electrical_report_eicr_expiry_date,
                    expiry_date.landlord_insurance_expiry_date,
                    expiry_date.portable_appliance_testing_expiry_date,
                    expiry_date.energy_performance_epc_expiry_date,
                    expiry_date.term_of_business_expiry_date,
                    info.property_id,
                    mortgageFile,
                    tenancyFile,
                    landlordInsuranceFile,
                    electricalReportFile,
                    portableApplianceTestingFile,
                    energyPerformanceFile,
                    termOfBusinessFile
                );
                return {
                    success: true,
                    status: restApiResponseStatus.OK,
                    msg: "File Uploaded Succefully",
                    info: document,
                };
            }
        } else {
            return {
                success: true,
                status: restApiResponseStatus.NotFound,
                msg: "Property not found for document."
            };
        }

    }

    async propertyEdit(id: bigint, data: EditProperty): Promise<EditPropertys> {
        const properyDetails = await this.propertyRepo.getPropertyIdEdit(
            id,
            data.property_id
        );
        if (data.roi) {
            const roiproperty = await this.propertyRepo.RoiUpdate(
                properyDetails.id,
                data.roi
            );
            if (!roiproperty) {
                return {
                    success: false,
                    status: restApiResponseStatus.BadRequest,
                    msg: "something wrong property",
                };
            }
            const getRoi = await this.propertyRepo.getRoiDetailById(properyDetails.id)
            if (!getRoi) {
                return {
                    success: false,
                    status: restApiResponseStatus.NotFound,
                    msg: "Roi not found",
                };
            }
            const info = {
                monthly_net_income: getRoi.gross_monthly_income - getRoi.mortgage_payment - getRoi.ground_rent - getRoi.management_fee - getRoi.service_charge,
                previous_monthly_net_income: getRoi.monthly_net_income
            }
            const previousRoiProperty = await this.propertyRepo.RoiUpdate(properyDetails.id, info);
            const property_info = {
                property_estimate : data.roi.property_estimate
            }
            const propertyUpdateResult = await this.propertyRepo.PropertyUpdate(properyDetails.id, property_info)
            if (!propertyUpdateResult) {
                return {
                    success: false,
                    status: restApiResponseStatus.NotFound,
                    msg: "Property value is not able to update",
                };
            }
            const latestRoi = await this.propertyRepo.getRoiDetailById(properyDetails.id)
        }
        if(data.property) {
            try {
                if (properyDetails.id) {
                    const propertyUpdateResult = await this.propertyRepo.PropertyUpdate(
                        properyDetails.id,
                        data.property
                    );
                    if (!propertyUpdateResult) {
                        throw new Error("Property update failed");
                    } 
                } else {
                    throw new Error("Invalid property ID");
                }
            } catch (error) {
                console.error('Error updating property estimate:', error);
                throw new Error('Failed to update property estimate');
            }
        }
        
        
        if (data.ownership) {
            const ownershipproperty = await this.propertyRepo.ownershipUpdate(
                properyDetails.id,
                data.ownership
            );

            if (!ownershipproperty) {
                throw new Error("Bad request");
            }
        }
        if (data.mortgage) {
            const mortagepproperty = await this.propertyRepo.mortageUpdate(
                properyDetails.id,
                data.mortgage
            );

            if (!mortagepproperty) {
                throw new Error("Bad request");
            }
        }
        if (data.insurance) {
            const insuranceproperty = await this.propertyRepo.insuranceUpdate(
                properyDetails.id,
                data.insurance
            );

            if (!insuranceproperty) {
                throw new Error("Bad request");
            }
        }
        if (data.letting) {
            const lettingproperty = await this.propertyRepo.lettingUpdate(
                properyDetails.id,
                data.letting
            );

            if (!lettingproperty) {
                throw new Error("Bad request");
            }
        }

        
        return {
            success: true,
            status: restApiResponseStatus.OK,
            msg: "property details update successfully.",
            data
        };
        
    }

    async documentList(id: bigint, data: AddProperty): Promise<PropertyRes> {
        const document = await this.propertyRepo.getPropertyDoc(
            id,
            data.property_id
        );
        if (!document) {
            return {
                success: false,
                status: restApiResponseStatus.NotFound,
                msg: "Document list not found",
            };
        }
        return {
            success: true,
            status: restApiResponseStatus.OK,
            msg: "Document list get successfully.",
            data: document,
        };
    }

    async allDocumentList(id: bigint): Promise<PropertyRes> {
        const document = await this.propertyRepo.getAllDocByUserId(id);
        if (!document) {
            return {
                success: false,
                status: restApiResponseStatus.NotFound,
                msg: "Document list not found",
            };
        }
        return {
            success: true,
            status: restApiResponseStatus.OK,
            msg: "All document list get successfully.",
            data: document,
        };
    }

    async getDocument(filename: string): Promise<any> {
        const document = await this.propertyRepo.viewDocument(filename);
        if (!document) {
            return {
                success: false,
                status: restApiResponseStatus.NotFound,
                msg: "Document not found",
            };
        }
        return {
            success: true,
            status: restApiResponseStatus.OK,
            msg: "Document get successfully.",
            data: document,
        };
    }

    async propertyValue(data: ValuationData): Promise<PostCodeRes> {
        const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: `https://api.propertydata.co.uk/valuation-sale?key=${appConfig.VALUTIONAPIKEY}&postcode=${data.postcode}&internal_area=${data.internal_area}&property_type=${data.property_type}&construction_date=${data.construction_date}&bedrooms=${data.bedrooms}&bathrooms=${data.bathrooms}&finish_quality=${data.finish_quality}&outdoor_space=${data.outdoor_space}&off_street_parking=${data.off_street_parking}`,
            headers: {
                Accept: "application/json",
            },
        };
        const property = await this.propertyRepo.propertyValue(config);
        if (!property.result) {
            return {
                success: false,
                status: restApiResponseStatus.NotFound,
                msg: "property valuation data not found",
            };
        }
        return {
            success: true,
            status: restApiResponseStatus.OK,
            msg: "Property vauation sale estimate and margin",
            data: property,
        };
    }

    async monthlyValuation(id: bigint, info: any): Promise<PropertyListRes> {
        const property = await this.propertyRepo.getValuationData(
            id,
            info.propertyIDS
        );
        if (!property) {
            return {
                success: false,
                status: restApiResponseStatus.BadRequest,
                msg: "something wrong propertyDetail",
            };
        }
        const dataPromises = property.map(async (val: string) => {
            let date = new Date();
            if (val["date_now"] === moment(date).format("DD/MM/YYYY")) {
                const config = {
                    method: "get",
                    maxBodyLength: Infinity,
                    url: `https://api.propertydata.co.uk/valuation-sale?key=${appConfig.VALUTIONAPIKEY}&postcode=${val["post_code"]}&internal_area=${val["internal_area"]}&property_type=${val["property_type"]}&construction_date=${val["construction_date"]}&bedrooms=${val["no_of_bedroom"]}&bathrooms=${val["no_of_bathroom"]}&finish_quality=${val["finish_quality"]}&outdoor_space=${val["outdoor_space"]}&off_street_parking=${val["off_street_parking"]}`,
                    headers: {
                        Accept: "application/json",
                    },
                };
                const property = await this.propertyRepo.propertyValue(config);
                const values = {
                    estimate: property.result.estimate,
                    margin: property.result.margin,
                    previous_estimate: val["property_estimate"],
                    previous_margin: val["property_margin"],
                };

                const propertyDetail = await this.propertyRepo.propertyUpdate(
                    val["propertyID"],
                    values
                );
                return {
                    "estimate": property.result.estimate,
                    "margin": property.result.margin,
                    "previous_estimate": val["property_estimate"],
                    "previous_margin": val["property_margin"],
                }
            }
        });
        const data = await Promise.all(dataPromises);
        return {
            success: true,
            status: restApiResponseStatus.OK,
            msg: "Get property valuation details.",
            datas: data,
        };
    }

    async monthlyStatement(data: any): Promise<any> {
        const url = `https://ukapi.staging.payprop.com/api/agency/v1.1/documents/pdf/owner-statement`;
        const queryParams = `property_id=${data.property_id}&beneficiary_id=${data.beneficiary_id}&from_date=${data.from_date}&to_date=${data.to_date}`;
        const urlWithParams = `${url}?${queryParams}`;
        const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: urlWithParams,
            headers: {
                Accept: "application/octet-stream",
                Authorization: `APIkey ${appConfig.PAYPROPAPIKEY}`,
            },
            responseType: 'arraybuffer'
        };
        const property = await this.propertyRepo.monthlyStatement(config);
        if (!property) {
            return {
                success: false,
                status: restApiResponseStatus.BadRequest,
                msg: "something wrong in monthly statement",
            };
        }
        return {
            success: true,
            status: restApiResponseStatus.OK,
            data: property,
        };
    }

    async allDocumentExpiry(id: bigint, data: AddProperty): Promise<PropertyRes> {
        const property = await this.propertyRepo.getAllDocExpiry(id, data.property_id);
        if (!property) {
            return {
                success: false,
                status: restApiResponseStatus.NotFound,
                msg: "Document list not found",
            };
        }
        return {
            success: true,
            status: restApiResponseStatus.OK,
            msg: "All Expiry document list get successfully.",
            data: property,
        };
    }

}
