import * as winston from 'winston'
import JWTRedis from './../utils/auth.jwt'
import appConfig from "../config/app.config";
import { appErrorMessage } from "../utils/appErrorMessage";
import { restApiResponseStatus } from "../utils/restApiResponseStatus";
import { Request, Response, NextFunction } from 'express';

const validToken = function(req:Request, res:Response, next:NextFunction) {

    let token =req.headers['authorization']; 
    if(token) {
        token = token.replace(/^Bearer\s/, '');
    }

    if(token)
    {
        let jwt = new JWTRedis()
        jwt.verifyToken(token)
        .then(_decoded => {
            if(_decoded){
             req.body.user = _decoded;
                return next();
            }else{
               return res.status(restApiResponseStatus.Unauthorized).send(appErrorMessage.INVALIDTOKEN)
            }
        })
        .catch(err =>{
            return res.status(restApiResponseStatus.InternalServerError).send(appErrorMessage.EXCEPTION)
        })
    }else{
        return res.status(restApiResponseStatus.Unauthorized).send(appErrorMessage.INVALIDTOKEN)
    } 
  };
  export default validToken