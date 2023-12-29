import request = require('request');
import { Insurance, Letting, Mortgage, Ownership, Properties, PostCodeData, Roi, PostCodeConfig, Document } from "../types/type";
import { Property } from "../models/property.seq.model.js";
import { RoiProperty } from "../models/Roi.property.seq.model.js";
import { InsuranceProperty } from "../models/insurance.property.seq.model";
import { OwnershipProperty } from "../models/ownership.property.model";
import { MortgageProperty } from "../models/mortgage.property.seq.model";
import { LettingProperty } from "../models/letting.property.seq.model";
import { Op } from "sequelize";
import { Documents } from '../models/docment.property.seq.model';
import { restApiResponseStatus } from '../utils/restApiResponseStatus';
import { QueryTypes } from 'sequelize';
import moment = require('moment');
import PdfParse = require("pdf-parse");
const axios = require('axios');
export class PropertyRepo {
    async getProertyDetailById(id: bigint, info: Properties) {
        console.log("infom" , info)
        return new Promise<any>((res, rej) => {
            Property.findAll({
                where: { [Op.and]: [{ user_id: id }, { property_name: info.property_name }, { address: info.address }] }
            })
                .then(data => {
                    res(data)
                })
                .catch((err) => {
                    rej(err)
                })
        })
    }

    async getProertyDataById(id: bigint, info: Properties) {
        return new Promise<any>((res, rej) => {
            Property.findOne({
                where: { [Op.and]: [{ user_id: id }, { address: info.address }] }
            })
                .then(data => {
                    res(data)
                })
                .catch((err) => {
                    rej(err)
                })
        })
    }
 
    async addProperty(userId: bigint, info: Properties) {
        return new Promise<Properties>((res, rej) => {
            const afterDate = new Date();
            const futureDate = moment(afterDate).format("DD/MM/YYYY");
            Property.create({
                property_name: info.property_name,
                address: info.address,
                user_id: userId,
                property_estimate: info.property_estimate,
                property_margin: info.property_margin,
                date_now: futureDate
            })
                .then((data) => {
                    res(data);
                })
                .catch((err) => {
                    rej(err);
                });
        });
    }

    async addRoi(propertyId: bigint, info: Roi, propertyEstimate) {
        return new Promise<Roi>((res, rej) => {
            console.log("propertyEstimate" , propertyEstimate)
            RoiProperty.create({
                gross_monthly_income: info.gross_monthly_income,
                mortgage_payment: info.mortgage_payment,
                management_fee: info.management_fee,
                ground_rent: info.ground_rent,
                service_charge: info.service_charge,
                property_id: propertyId,
                property_estimate: propertyEstimate , //help 
                monthly_net_income: info.gross_monthly_income - info.mortgage_payment - info.ground_rent - info.management_fee - info.service_charge,

            })
                .then((affectedCount: Roi) => {
                    if (affectedCount) {
                        res(info);
                    } else {
                        rej(new Error('No rows were updated.'));
                    }
                })
                .catch((err) => {
                    rej(err);
                });
        });
    }

    async addInsurance(propertyId: bigint, info: Insurance) {
        return new Promise<Insurance>((res, rej) => {
            InsuranceProperty.create({
                type: info.type,
                provider: info.provider,
                expiry: info.expiry,
                property_id: propertyId
            })
                .then((affectedCount) => {
                    if (affectedCount) {
                        res(info);
                    } else {
                        rej(new Error('No rows were updated.'));
                    }
                })
                .catch((err) => {
                    rej(err);
                });
        });
    }

    async addOwnership(propertyId: bigint, info: Ownership) {
        return new Promise<Ownership>((res, rej) => {
            OwnershipProperty.create({
                company_number: info.company_number,
                type: info.type,
                property_id: propertyId,
                property_type: info.property_type,
                construction_date: info.construction_date,
                no_of_bedroom: info.no_of_bedroom,
                no_of_bathroom: info.no_of_bathroom,
                finish_quality: info.finish_quality,
                outdoor_space: info.outdoor_space,
                off_street_parking: info.off_street_parking,
                internal_area: info.internal_area,
                post_code: info.post_code
            })
                .then((affectedCount) => {
                    if (affectedCount) {
                        res(info);
                    } else {
                        rej(new Error('No rows were updated.'));
                    }
                })
                .catch((err) => {
                    rej(err);
                });
        });
    }

    async addMortgage(propertyId: bigint, info: Mortgage) {
        return new Promise<Mortgage>((res, rej) => {
            MortgageProperty.create({
                debt: info.debt,
                type: info.type,
                interest_rate: info.interest_rate,
                provider: info.provider,
                expiry: info.expiry,
                property_id: propertyId
            })
                .then((affectedCount) => {
                    if (affectedCount) {
                        res(info);
                    } else {
                        rej(new Error('No rows were updated.'));
                    }
                })
                .catch((err) => {
                    rej(err);
                });
        });
    }

    async addLetting(propertyId: bigint, info: Letting) {
        const tenantName = info.current_tenent.join(',')
        try {
            LettingProperty.create({
                current_tenent: tenantName,
                tenant_expiry: info.tenant_expiry,
                property_id: propertyId,
                beneficiary_id: info.beneficiary_id,
                payprop_property_id: info.payprop_property_id
            });
            return info;
        }
        catch (error) {
            throw error;
        }
    }

    async searchPostcode(config: PostCodeConfig) {
        return new Promise<PostCodeData>((res, rej) => {
            request(config, (error: any, response) => {
                if (error) throw new Error(error);
                function jsonEscape(str) {
                    return str.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
                }
                var dataObj = JSON.parse(jsonEscape(response.body));
                res(dataObj.result)
            })
        });
    }

    async propertyList(id: bigint) {
        return new Promise<any>((res, rej) => {
            Property.sequelize.query("SELECT property.id,users.id AS userId, users.full_name AS userName, users.user_type AS users_userType, property.property_name, property.address, property.property_estimate, property.property_margin, property.previous_estimate, property.previous_margin, roi.property_id, roi.gross_monthly_income, roi.mortgage_payment, roi.management_fee, roi.ground_rent, roi.service_charge, roi.monthly_net_income, roi.previous_monthly_net_income, mortgage.debt, mortgage.type AS mortgage_type, mortgage.interest_rate, mortgage.provider AS mortgage_provider, mortgage.expiry AS mortgage_expiry, ownership.company_number, ownership.type AS ownership_type, ownership.property_type, ownership.construction_date, ownership.no_of_bedroom, ownership.no_of_bathroom, ownership.finish_quality, ownership.outdoor_space, ownership.off_street_parking, ownership.internal_area, insurance.provider AS insurance_provider, insurance.user_type as insurance_type, insurance.expiry AS insurance_expiry, letting.current_tenent, letting.tenant_expiry FROM users INNER JOIN property ON users.id = property.user_id INNER JOIN roi ON property.id = roi.property_id INNER JOIN mortgage ON property.id = mortgage.property_id INNER JOIN ownership ON property.id = ownership.property_id INNER JOIN insurance ON property.id = insurance.property_id INNER JOIN letting ON property.id = letting.property_id WHERE users.id = :user_id",
                { replacements: { user_id: id }, type: QueryTypes.SELECT })
                .then((data) => {
                    res(data);
                }).catch((err) => {
                    rej(err);
                });
        });
    }

    async propertyDetail(id: bigint, propertyID: number) {
        return new Promise<any>((res, rej) => {
            if (propertyID === undefined) {
                return {
                    success: false,
                    status: restApiResponseStatus.BadRequest,
                    msg: "propertyId is undefined",
                };
            }
            Property.sequelize.query("SELECT users.full_name AS userName, users.user_type AS users_userType, property.property_name, property.address,property.property_estimate, property.previous_estimate, property.previous_margin, roi.property_id, roi.gross_monthly_income, roi.mortgage_payment, roi.management_fee, roi.ground_rent, roi.service_charge, roi.monthly_net_income, roi.previous_monthly_net_income, mortgage.debt, mortgage.type AS mortgage_type, mortgage.interest_rate, mortgage.provider AS mortgage_provider, mortgage.expiry AS mortgage_expiry, ownership.company_number, ownership.type AS ownership_type, insurance.provider AS insurance_provider, insurance.user_type as insurance_type, insurance.expiry AS insurance_expiry, letting.current_tenent, letting.tenant_expiry FROM users INNER JOIN property ON users.id = property.user_id INNER JOIN roi ON property.id = roi.property_id INNER JOIN mortgage ON property.id = mortgage.property_id INNER JOIN ownership ON property.id = ownership.property_id INNER JOIN insurance ON property.id = insurance.property_id INNER JOIN letting ON property.id = letting.property_id WHERE users.id = :user_id and property.id = :property_id",
                { replacements: { user_id: id, property_id: propertyID }, type: QueryTypes.SELECT })
                .then(data => {
                    if (data.length < 0) {
                        rej("No data found");
                        return;
                    }
                    res(data.pop());
                }).catch((err) => {
                    rej(err);
                });
        });
    }

    async documentUpload(id: bigint,
        property_id: bigint,
        mortgageFile: string,
        mortgage_statement_expiry_date: string,
        tenancyFile: string,
        tenancy_aggrement_expiry_date: string,
        landlordInsuranceFile: string,
        landlord_insurance_expiry_date: string,
        electricalReportFile: string,
        electrical_report_eicr_expiry_date: string,
        portableApplianceTestingFile: string,
        portable_appliance_testing_expiry_date: string,
        energyPerformanceFile: string,
        energy_performance_epc_expiry_date: string,
        termOfBusinessFile: string,
        term_of_business_expiry_date: string
    ) {
        return new Promise<Document>((res, rej) => {
            Documents.create({
                user_id: id,
                property_id: property_id,
                mortgage_statement: mortgageFile,
                tenancy_aggrement: tenancyFile,
                mortgage_statement_expiry_date: mortgage_statement_expiry_date,
                tenancy_aggrement_expiry_date: tenancy_aggrement_expiry_date,
                landlord_insurance: landlordInsuranceFile,
                electrical_report_eicr: electricalReportFile,
                portable_appliance_testing: portableApplianceTestingFile,
                energy_performance_epc: energyPerformanceFile,
                term_of_business: termOfBusinessFile,
                electrical_report_eicr_expiry_date: electrical_report_eicr_expiry_date,
                landlord_insurance_expiry_date: landlord_insurance_expiry_date,
                portable_appliance_testing_expiry_date: portable_appliance_testing_expiry_date,
                energy_performance_epc_expiry_date: energy_performance_epc_expiry_date,
                term_of_business_expiry_date: term_of_business_expiry_date

            })
                .then(data => {
                    res(data);
                }).catch((err) => {
                    rej(err);
                });
        });
    }

    async getPropertyIdEdit(id: bigint, propertyId: bigint) {
       
        return new Promise<any>((res, rej) => {
            Property.findOne({
                where: { [Op.and]: [{ user_id: id }, { id: propertyId }] }
            })
                .then((data) => {
                    res(data);
                })
                .catch((err) => {
                    rej(err);
                });
        });
    }

    // async PropertyUpdate(propertyId: bigint, info: Properties) {

    //     console.log("propertyIdsss", propertyId);
    //     if (!propertyId) {
    //         throw new Error("Invalid property ID");
    //     }
    
    //     return new Promise<Properties>((res, rej) => {
    //         Property.update(
    //             { property_estimate: info.property_estimate },
    //             { where: { property_id: propertyId } }
    //         )
    //             .then((affectedCount) => {
    //                 console.log("Rows updated:", affectedCount);
    //                 if (affectedCount) {
    //                     res(info);
    //                 } else {
    //                     rej(new Error("No rows were updated."));
    //                 }
    //             })
    //             .catch((err) => {
    //                 console.error("Error updating property estimate:", err);
    //                 rej(err);
    //             });
    //     });
    // }

        async PropertyUpdate(id: bigint, info: Properties) {
       console.log("i am at sssss",info.property_estimate)
    return new Promise<any>((res, rej) => {
            const afterDate = new Date();
           afterDate.setDate(afterDate.getDate() + 30);
            const futureDate = moment(afterDate).format("DD/MM/YYYY");
            Property.update({
               property_estimate: info.property_estimate,
                property_margin: info.property_margin,
                previous_estimate: info.previous_estimate,
                previous_margin: info.previous_margin,
                date_now: futureDate
            },
                { where: { id: id } }
            ).then((affectedCount) => {
                console.log("affectedCount",affectedCount)
                res(affectedCount);
            })
                .catch((err) => {
                   rej(err);
               });
       });
    }
    



    async  RoiUpdate(propertyId: bigint, info: Roi) {
        console.log("info", info);
       
        return new Promise<Roi>((res, rej) => {
            RoiProperty.update(
                {
                    gross_monthly_income: info.gross_monthly_income,
                    mortgage_payment: info.mortgage_payment,
                    management_fee: info.management_fee,
                    ground_rent: info.ground_rent,
                    service_charge: info.service_charge,
                    monthly_net_income: info.monthly_net_income,
                    previous_monthly_net_income: info.previous_monthly_net_income,
                    property_estimate: info.property_estimate,
                },
                { where: { property_id: propertyId } }
            )
                .then(async (affectedCount) => {
                    if (affectedCount) {
                         res(info);
                    } else {
                        rej(new Error("No rows were updated."));
                    }
                })
                .catch((err) => {
                    rej(err);
                });
        });
    }
    



    async getRoiDetailById(property_id: bigint) {
        return new Promise<any>((res, rej) => {
            RoiProperty.findOne({
                where: { property_id: property_id }
            })
                .then(data => {
                    res(data)
                })
                .catch((err) => {
                    rej(err)
                })
        })
    }

    async getPropertyDoc(id: bigint, propertyId: bigint) {
        return new Promise<any>(async (res, rej) => {
            await Property.findOne({
                where: { [Op.and]: [{ user_id: id }, { id: propertyId }] },
                attributes: ['id', 'property_name', 'address'],
                include: [{
                    model: Documents,
                    as: 'documentDetail',
                    attributes: ['mortgage_statement', 'landlord_insurance']
                }, {
                    model: Documents,
                    as: 'lettingDetail',
                    attributes: ['tenancy_aggrement', 'term_of_business', 'electrical_report_eicr', 'portable_appliance_testing', 'energy_performance_epc']
                }, {
                    model: Documents,
                    as: 'documentExpiry',
                    attributes: ['mortgage_statement_expiry_date', 'landlord_insurance_expiry_date'],
                }, {
                    model: Documents,
                    as: 'lettingExpiry',
                    attributes: ['tenancy_aggrement_expiry_date', 'electrical_report_eicr_expiry_date', 'portable_appliance_testing_expiry_date', 'energy_performance_epc_expiry_date', 'term_of_business_expiry_date'],
                }]
            })
                .then(data => {
                    res(data)
                })
                .catch((err) => {
                    rej(err)
                })
        })
    }

    async getAllDocByUserId(id: bigint) {
        return new Promise<any>(async (res, rej) => {
            await Property.findAll({
                where: { user_id: id },
                attributes: ['id', 'property_name', 'address'],
                raw: true,
                include: [{
                    model: Documents,
                    as: 'documentDetail',
                    attributes: ['mortgage_statement', 'landlord_insurance', 'tenancy_aggrement', 'term_of_business', 'electrical_report_eicr', 'portable_appliance_testing', 'energy_performance_epc'],
                }],
            })
                .then(data => {
                    res(data)
                })
                .catch((err) => {
                    rej(err)
                })
        })
    }

    async editDocument(
        id: bigint,
        mortgage_statement_expiry_date: string,
        tenancy_aggrement_expiry_date: string,
        electrical_report_eicr_expiry_date: string,
        landlord_insurance_expiry_date: string,
        portable_appliance_testing_expiry_date: string,
        energy_performance_epc_expiry_date: string,
        term_of_business_expiry_date: string,
        property_id: bigint,
        mortgageFile: string,
        tenancyFile: string,
        landlordInsuranceFile: string,
        electricalReportFile: string,
        portableApplianceTestingFile: string,
        energyPerformanceFile: string,
        termOfBusinessFile: string,
    ) {
        return new Promise<any>(async (res, rej) => {
            await Documents.upsert({
                user_id: id,
                property_id: property_id,
                mortgage_statement: mortgageFile,
                tenancy_aggrement: tenancyFile,
                landlord_insurance: landlordInsuranceFile,
                electrical_report_eicr: electricalReportFile,
                portable_appliance_testing: portableApplianceTestingFile,
                energy_performance_epc: energyPerformanceFile,
                term_of_business: termOfBusinessFile,
                mortgage_statement_expiry_date: mortgage_statement_expiry_date,
                tenancy_aggrement_expiry_date: tenancy_aggrement_expiry_date,
                electrical_report_eicr_expiry_date: electrical_report_eicr_expiry_date,
                landlord_insurance_expiry_date: landlord_insurance_expiry_date,
                portable_appliance_testing_expiry_date: portable_appliance_testing_expiry_date,
                energy_performance_epc_expiry_date: energy_performance_epc_expiry_date,
                term_of_business_expiry_date: term_of_business_expiry_date
            })
                .then(data => {
                    res(data);
                }).catch((err) => {
                    rej(err);
                });
        });
    }

    async ownershipUpdate(propertyId: bigint, info: Ownership) {
        return new Promise<Ownership>((res, rej) => {
            OwnershipProperty.update(
                { company_number: info.company_number, type: info.type },
                { where: { property_id: propertyId } }
            )
                .then((affectedCount) => {
                    if (affectedCount) {
                        res(info);
                    } else {
                        rej(new Error("No rows were updated."));
                    }
                })
                .catch((err) => {
                    rej(err);
                });
        });
    }

    async mortageUpdate(propertyId: bigint, info: Mortgage) {
        return new Promise<Mortgage>((res, rej) => {
            MortgageProperty.update(
                {
                    debt: info.debt,
                    type: info.type,
                    interest_rate: info.interest_rate,
                    provider: info.provider,
                    expiry: info.expiry,
                },
                { where: { property_id: propertyId } }
            )
                .then((affectedCount) => {
                    if (affectedCount) {
                        res(info);
                    } else {
                        rej(new Error("No rows were updated."));
                    }
                })
                .catch((err) => {
                    rej(err);
                });
        });
    }

    async insuranceUpdate(propertyId: bigint, info: Insurance) {
        return new Promise<Insurance>((res, rej) => {
            InsuranceProperty.update(
                { type: info.type, provider: info.provider, expiry: info.expiry },
                { where: { property_id: propertyId } }
            )
                .then((affectedCount) => {
                    if (affectedCount) {
                        res(info);
                    } else {
                        rej(new Error("No rows were updated."));
                    }
                })
                .catch((err) => {
                    rej(err);
                });
        });
    }

    async lettingUpdate(propertyId: bigint, info: Letting) {
        return new Promise<Letting>((res, rej) => {
            const tenantName = info.current_tenent.join(",");
            LettingProperty.update(
                {
                    current_tenent: tenantName,
                    tenant_expiry: info.tenant_expiry,
                },
                { where: { property_id: propertyId } }
            )
                .then((affectedCount) => {
                    if (affectedCount) {
                        res(info);
                    } else {
                        rej(new Error("No rows were updated."));
                    }
                })
                .catch((err) => {
                    rej(err);
                });
        });
    }

    async viewDocument(filename: string) {
        return new Promise<any>((res, rej) => {
            Documents.findOne({
                where: {
                    [Op.or]: [
                        { mortgage_statement: filename },
                        { tenancy_aggrement: filename },
                        { landlord_insurance: filename },
                        { electrical_report_eicr: filename },
                        { portable_appliance_testing: filename },
                        { energy_performance_epc: filename },
                        { term_of_business: filename }]
                }
            }).then(data => {
                res(data);
            }).catch((err) => {
                rej(err);
            });
        });
    }

    async propertyValue(config: any) {
        return new Promise<any>((res, rej) => {
            request(config, (error: any, response: any) => {
                if (error) throw new Error(error);
                function jsonEscape(str) {
                    return str.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
                }
                var result = JSON.parse(jsonEscape(response.body));
                res(result)
            })
        });
    }

    async getValuationData(id: bigint, propertyIDS: any) {
        return new Promise<any>((res, rej) => {
            if (propertyIDS === undefined) {
                return {
                    success: false,
                    status: restApiResponseStatus.BadRequest,
                    msg: "propertyId is undefined",
                };
            }
            Property.sequelize.query("SELECT property.id AS propertyID, property.property_name, property.address, property.property_estimate, property.property_margin, property.previous_estimate, property.previous_margin, property.date_now, ownership.post_code, ownership.company_number, ownership.type, ownership.property_type, ownership.construction_date, ownership.no_of_bedroom, ownership.no_of_bathroom, ownership.finish_quality, ownership.outdoor_space, ownership.off_street_parking, ownership.internal_area FROM users INNER JOIN property ON users.id = property.user_id INNER JOIN ownership ON property.id = ownership.property_id WHERE users.id = :user_id and property.id IN (:property_id)",
                { replacements: { user_id: id, property_id: propertyIDS }, type: QueryTypes.SELECT })
                .then(data => {
                    if (data.length < 0) {
                        rej("No data found");
                        return;
                    }
                    res(data);
                }).catch((err) => {
                    rej(err);
                });
        });
    }

   // async propertyUpdate(id: bigint, info: Properties) {
   //     console.log("i am at sssss",info.property_estimate)
  //      return new Promise<any>((res, rej) => {
    //        const afterDate = new Date();
  //          afterDate.setDate(afterDate.getDate() + 30);
   //         const futureDate = moment(afterDate).format("DD/MM/YYYY");
    //        Property.update({
     //           property_estimate: info.property_estimate,
       //         property_margin: info.property_margin,
      //          previous_estimate: info.previous_estimate,
      //          previous_margin: info.previous_margin,
        //        date_now: futureDate
        //    },
          //      { where: { id: id } }
          //  ).then((affectedCount) => {
            //    console.log("affectedCount",affectedCount)
              //  res(affectedCount);
           // })
             //   .catch((err) => {
               //     rej(err);
            //    });
      //  });
  //  }

  async propertyUpdate(id: bigint, info: any) {
       
    return new Promise<any>((res, rej) => {
        const afterDate = new Date();
        afterDate.setDate(afterDate.getDate() + 30);
        const futureDate = moment(afterDate).format("DD/MM/YYYY");
        Property.update({
            property_estimate: info.estimate,
            property_margin: info.margin,
            previous_estimate: info.previous_estimate,
            previous_margin: info.previous_margin,
            date_now: futureDate
        },
            { where: { id: id } }
        ).then((affectedCount) => {
            res(affectedCount);
            console.log("function call")
        })
            .catch((err) => {
                rej(err);
            });
    });
}



    

    async getEstimateMargin(propertyIDS: bigint, previous_estimate: number, previous_margin: number) {
        return new Promise<any>((res, rej) => {
            Property.findOne({
                where: {
                    [Op.and]: [
                        { id: propertyIDS },
                        { previous_estimate: previous_estimate },
                        { previous_margin: previous_margin }
                    ]
                }
            }).then((affectedCount) => {
                res(affectedCount);
            }).catch((err) => {
                rej(err);
            });
        });
    }

    async monthlyStatement(config: any) {
        return new Promise<any>(async (res, rej) => {
            request(config, async (error: any, respons: any) => {
                if (error) throw new Error(error);
                const response = await axios(config);

                const pdfBuffer = Buffer.from(response.data);
                const pdfData = await PdfParse(pdfBuffer);
                // function jsonEscape(str) {
                //     return str.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
                // }
                var result = pdfData.text.trim().split('\n');
                const object = {};
                for (let i = 0; i < result.length; i++) {
                    object[i] = result[i];
                }
                res(object)
            })
        });
    }

    async getDocumentById(id: bigint, property_id: bigint) {
        return new Promise<any>((res, rej) => {
            Documents.findOne({
                where: { [Op.and]: [{ user_id: id }, { property_id: property_id }] }
            })
                .then((data) => {
                    res(data);
                })
                .catch((err) => {
                    rej(err);
                });
        });
    }

    async getAllDocExpiry(id: bigint, propertyId: bigint) {
        return new Promise<any>(async (res, rej) => {
            await Property.findOne({
                where: { [Op.and]: [{ user_id: id }, { id: propertyId }] },
                attributes: ['id', 'property_name'],
                include: [{
                    model: Documents,
                    as: 'documentExpiry',
                    attributes: ['mortgage_statement_expiry_date', 'landlord_insurance_expiry_date'],
                },
                {
                    model: Documents,
                    as: 'lettingExpiry',
                    attributes: ['tenancy_aggrement_expiry_date', 'electrical_report_eicr_expiry_date', 'portable_appliance_testing_expiry_date', 'energy_performance_epc_expiry_date', 'term_of_business_expiry_date'],
                }],
            })
                .then(data => {
                    res(data)
                })
                .catch((err) => {
                    rej(err)
                })
        })
    }
}