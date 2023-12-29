import { Express } from "express";
import { PropertyController } from "../controllers/Property.controllers";
import validate from "../requests/user.request";
import validToken from "../middleware/auth.jwt.middleware"

const property = new PropertyController();

export function propertyRoutes(app: Express) {
    app.post("/api/addproperty", validToken, validate('addproperty'), property.addProperty);
    app.post("/api/searchPostcode", validate("postcode"), property.postCode);
    app.post("/api/portfolio", validToken, property.portfolio);
    app.get("/api/propertList", validToken, property.propertiesList);
    app.post("/api/propertyDetail", validToken, property.propertyDetail);
    app.post('/api/upload', validToken, property.documentUpload);
    app.put("/api/propertyEdit", validToken, property.propertyEdit);
    app.post('/api/documentList', validToken, property.documentList);
    app.get("/api/getDoc/:name", property.getDocument);
    app.post('/api/property-valuation-sale', validToken, property.propertyValue);
    app.post("/api/monthly-valuation", validToken, property.monthlyValuation);
    app.get('/api/monthly-statement', property.monthlyStatement);
    app.get('/api/allDocumentList', validToken, property.allDocumentList);
    app.get('/api/sendPortfolio', validToken, property.sendPortfolio);
    app.post('/api/getDocExpiry', validToken, property.allDocumentExpiry);
}

