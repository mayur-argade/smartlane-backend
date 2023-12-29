import * as multer from "multer";
import path = require("path");
import * as util from 'util';
// const baseUrl = '/var/www/html/uploads'
const baseUrl = '../../src/uploads'

// const pdfFilter = (req: any, file: any, cb: any) => {
//   if (file.mimetype === 'application/pdf') {
//     // Allow PDF files
//     cb(null, true);
//   } else {
//     // Reject other file types
//     cb(new Error('Only PDF files are allowed'), false);
//   }
// };

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, baseUrl + '/'));
  },
  filename: (req: any, file: any, cb: any) => {
    const modifiedFilename = `${Date.now()}-${file.originalname}`;
    cb(null, modifiedFilename);
  },
});

const uploadFiles = multer({
  storage: storage,
  // fileFilter: pdfFilter 
}).fields([
  { name: 'mortgage_statement', maxCount: 1 },
  { name: 'tenancy_aggrement', maxCount: 1 },
  { name: 'landlord_insurance', maxCount: 1 },
  { name: 'electrical_report_eicr', maxCount: 1 },
  { name: 'portable_appliance_testing', maxCount: 1 },
  { name: 'energy_performance_epc', maxCount: 1 },
  { name: 'term_of_business', maxCount: 1 }

])

let uploadFileMiddleware = util.promisify(uploadFiles);
export default uploadFiles;