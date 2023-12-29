import { Express, Request, Response } from 'express'
import * as winston from 'winston'
import { AuthUserRoutes } from './authuser.routes';
import { propertyRoutes } from './proprty.routes';
import { notificationRoutes } from './notification.routes';
import { AdminRoutes } from './admin.routes';
const swagger_UI = require("swagger-ui-express")
const swaggerDoc = require('../../src/swagger/swagger.json')
const basicAuth = require("express-basic-auth");
//internal services, not publicly available. directly called by other micro services
const swaggerCSS = {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Smartlane",
};
export function initRoutes(app: Express) {
  winston.log('info', '--> Initialisations des routes')
  app.use(
    "/api-docs",
    basicAuth({
      users: { neelam: "neelam@123" },
      challenge: true,
    }),
    swagger_UI.serve,
    swagger_UI.setup(swaggerDoc, swaggerCSS)
  );
  app.get('/api', (req: Request, res: Response) => res.status(200).send({
    message: 'server is listening!'
  }))

  AuthUserRoutes(app)
  propertyRoutes(app)
  notificationRoutes(app)
  AdminRoutes(app)
  //app.use(AuthUserRoutes)
  app.all('*', (req: Request, res: Response) => res.status(404).send())
}