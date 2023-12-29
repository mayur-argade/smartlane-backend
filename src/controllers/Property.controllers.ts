import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { PropertyService } from "../services/property.service";
import { UserRepo } from "../repository/user.repo";
import { PropertyRepo } from "../repository/property.repo";
import uploadFiles from "../utils/multer";
import * as path from 'path';
// const baseUrl = 'http://13.40.188.117/uploads/'
const baseUrl = '../../src/uploads'
import * as fs from 'fs'


const propertyService = new PropertyService(new PropertyRepo(), new UserRepo());

export class PropertyController {
  constructor() { }
  async addProperty(req: Request, res: Response) {
    const id = (req.body.user) ? req.body.user.id : req.body.id;
    const arg = await propertyService.addProperty(id, req.body);
    return res.status(arg.status).json(arg);
  }

  async postCode(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const arg = await propertyService.postCode(req.body);
    return res.status(arg.status).json(arg);
  }

  async propertiesList(req: Request, res: Response) {
    const id = (req.body.user) ? req.body.user.id : req.body.id;
    const arg = await propertyService.propertiesList(id);
    return res.status(arg.status).json(arg);
  }

  async sendPortfolio(req: Request, res: Response) {
    const id = (req.body.user) ? req.body.user.id : req.body.id;
    const arg = await propertyService.sendPortfolio(id);
    return res.status(arg.status).json(arg);
  }

  async portfolio(req: Request, res: Response) {
    const id = req.body?.user.id;
    const arg = await propertyService.portfolio(id);
    return res.status(arg.status).json(arg);
  }

  async propertyDetail(req: Request, res: Response) {
    const userId = (req.body.user) ? req.body.user.id : req.body.userId;
    const arg = await propertyService.propertyDetail(userId, req.body);
    return res.status(arg.status).json(arg);
  }

  async documentUpload(req: Request, res: Response) {
    const id = req.body.user?.id
    uploadFiles(req, res, async function (err: any) {
      if (err) {
        console.error("Error uploading files: ", err);
        res.status(500).json({ error: "Error uploading files" });
      } else {
        const files = req.files;
        if (!files) {
          res.status(400).json({ error: "No files uploaded" });
          return;
        }
        try {
          const mortgageFile = files["mortgage_statement"]?.[0];
          const tenancyFile = files["tenancy_aggrement"]?.[0];
          const landlordInsuranceFile = files["landlord_insurance"]?.[0];
          const electricalReportFile = files["electrical_report_eicr"]?.[0];
          const portableApplianceTestingFile = files["portable_appliance_testing"]?.[0];
          const energyPerformanceFile = files["energy_performance_epc"]?.[0];
          const termOfBusinessFile = files["term_of_business"]?.[0];

          const arg = await propertyService.documentUpload(
            (id !== undefined) ? id : req.body.id,
            req.body,
            mortgageFile?.filename,
            tenancyFile?.filename,
            landlordInsuranceFile?.filename,
            electricalReportFile?.filename,
            portableApplianceTestingFile?.filename,
            energyPerformanceFile?.filename,
            termOfBusinessFile?.filename,
          );

          return res.status(arg.status).json(arg);
        } catch (err) {
          console.error("Error storing files in database: ", err);
          res.status(500).json({ error: "Error storing files in database" });
        }
      }
    });
  }

  async propertyEdit(req: Request, res: Response) {
    const id = (req.body.user) ? req.body.user.id : req.body.id;
    const arg = await propertyService.propertyEdit(id, req.body);
    return res.status(arg.status).json(arg);
  }

  async documentList(req: Request, res: Response) {
    const id = (req.body.user) ? req.body.user.id : req.body.id;
    const arg = await propertyService.documentList(id, req.body);
    return res.status(arg.status).json(arg);
  }

  async allDocumentList(req: Request, res: Response) {
    const id = (req.body.user) ? req.body.user.id : req.body.id;
    const arg = await propertyService.allDocumentList(id);
    return res.status(arg.status).json(arg);
  }

  async getDocument(req: Request, res: Response) {
    const filename = req.params?.name;
    const arg = await propertyService.getDocument(filename);
    const filePath = path.join(__dirname, baseUrl + '/');

    if (arg.success) {
      const fileFullPath = path.join(filePath, filename);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'application/pdf'); // Change this as needed
      const fileStream = fs.createReadStream(fileFullPath);
      fileStream.pipe(res);
      fileStream.on('error', (err) => {
        console.error('Error streaming file:', err);
        res.status(500).send({
          message: 'Could not download the file. ' + err,
        });
      });

      fileStream.on('end', () => {
        console.log('File download successful:', filename);
      });
    } else {
      return res.status(arg.status).json(arg);
    }
  }

  async propertyValue(req: Request, res: Response) {
    const arg = await propertyService.propertyValue(req.body);
    return res.status(arg.status).json(arg);
  }

  async monthlyValuation(req: Request, res: Response) {
    const id = (req.body.user) ? req.body.user.id : req.body.id;
    const arg = await propertyService.monthlyValuation(id, req.body);
    return res.status(arg.status).json(arg);
  }

  async monthlyStatement(req: Request, res: Response) {
    const arg = await propertyService.monthlyStatement(req.body);
    return res.status(arg.status).json(arg);
  }

  async allDocumentExpiry(req: Request, res: Response) {
    const id = (req.body.user) ? req.body.user.id : req.body.id;
    const arg = await propertyService.allDocumentExpiry(id, req.body);
    return res.status(arg.status).json(arg);
  }
}
