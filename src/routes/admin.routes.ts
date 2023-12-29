import { Express } from "express";
import { AdminController } from "../controllers/Admin.controllers";
import { PropertyController } from "../controllers/Property.controllers";
import validate from "../requests/user.request";

const admin = new AdminController();
const property = new PropertyController();

export function AdminRoutes(app: Express) {
    app.post("/api/userAdd", admin.userAdd);
    app.post("/api/userEdit", admin.userEdit);
    app.get("/api/allProperty", admin.propertyList);
    app.delete("/api/propertyDelete", admin.delete);
    app.post("/api/filter", admin.filterUsers);
    app.post('/api/adminPropertyList', property.propertiesList);
    app.post("/api/adminPropertyDetail", property.propertyDetail);
    app.post("/api/adminAddProperty", validate('addproperty'), property.addProperty);
    app.post('/api/adminDocumentList', property.documentList);
    app.post("/api/admin-monthly-valuation", property.monthlyValuation);
    app.post('/api/adminDocUpload', property.documentUpload);
    app.put("/api/adminPropertyEdit", property.propertyEdit);
    app.post('/api/adminDocExpiry', property.allDocumentExpiry);
    app.post("/api/raiseMail", admin.raisePropertyMail);

}

