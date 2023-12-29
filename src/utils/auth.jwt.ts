import Redis from "./app.redis";
//import * as redis from 'redis';
import * as jsonwebtoken from 'jsonwebtoken';

import logger from "../utils/winston-logger";
import appConfig from "../config/app.config";

export class Data {
full_name:string;
email:string;
id:bigint;
}
export default class JWTRedis {
    private readonly redis: Redis;
    constructor() {
        this.redis = new Redis(appConfig.REDISPORT);
    }

    public async createToken(payload:Data)
    {
        await Promise.resolve();
        let response = null;
        logger.info("-------------------In createToken--------------", null);
        logger.info("-------------------In createToken - > payload--------------", payload);
        var token = jsonwebtoken.sign({
            full_name: payload.full_name,
            email: payload.email,
            id: payload.id,
            type: "token"
        },
            appConfig.TOKENSECRET,
            { expiresIn: appConfig.TOKENEXPIRY });
        var refreshToken = jsonwebtoken.sign({ email: payload.email, id: payload.id, type: "refresh_token" }, appConfig.TOKENSECRET, { expiresIn: appConfig.REFRESHTOKENEXPIRY });
        response = { token: token, refreshToken: refreshToken };
        await this.redis.set(payload.email, JSON.stringify(response));
        return await (response);
    }

    public async verifyToken(_token : string)
    {
        await Promise.resolve();
       // logger.info("verifyToken-->", { message: JSON.stringify(_token) });
        var userInfo = null;
        jsonwebtoken.verify(_token, appConfig.TOKENSECRET, function (err, decoded) {
            if (err) {
                return (null);
            }
            //logger.info(decoded) 
            userInfo = decoded;
            if (userInfo.type == "token")
                return (decoded);

            else
                return (null);
        });
        return await (userInfo);
    }

    public refreshToken(_refreshToken : string, client_id : string)
    {
        return new Promise((resolve, reject) => {
                logger.info(JSON.stringify(_refreshToken))
                var token = null
                var userInfo = null
               
                if(client_id == undefined || client_id == "")
                {
                    jsonwebtoken.verify(_refreshToken, appConfig.TOKENSECRET,{ignoreExpiration : false}, function(err, decoded) {
                        if (err) {
                            logger.info(err)
                            token = null
                            resolve(token)
                            return
                        }
                        console.log(decoded)
                        if(decoded){
                           userInfo = decoded    
                        }
    
                        if(decoded['type'] != "refresh_token")
                           {
                                token = null
                                resolve(token)
                                return
                           }
                            
                    });
                }else if (client_id == appConfig.APPCLIENTID)
                {

                    jsonwebtoken.verify(_refreshToken, appConfig.TOKENSECRET,{ignoreExpiration : true}, function(err, decoded) {
                        if (err) {
                            logger.info(err)
                            token = null
                            resolve(token)
                            return
                        }
                        if(decoded){
                           userInfo = decoded    
                        }
    
                        if(decoded['type'] != "refresh_token")
                           {
                                token = null
                                resolve(token)
                                return
                           }
                            
                    });

                }else
                {
                    token = null
                    resolve(token)
                    return
                }


               

                if(userInfo)
                {
                    this.redis.get(userInfo.id)
                    .then(_data =>{
                        _data = JSON.parse(_data)
                         logger.info("Data: ",{message: _data.refreshToken})
                        if(_data.refreshToken == _refreshToken)
                        {
                            var newToken = jsonwebtoken.sign({email:userInfo.email,id: userInfo.id,type:"token"},appConfig.TOKENSECRET,{expiresIn: appConfig.TOKENEXPIRY })
                            var response = {token : newToken , refreshToken : _data.refreshToken }
                            this.redis.set(userInfo.id, JSON.stringify(response))
                            .then(_data =>{
                                logger.debug("insert done")
                                token = {token : newToken}
                                logger.debug(token)
                                resolve(token)
                                return
                            })
                            .catch(_e =>{
                                logger.info(_e)
                                token = null
                                resolve(token)
                                return
                            })
                        }
                    })
                    .catch(err =>{
                        token = null
                        resolve(token)
                        return
                    })
                }
        })as Promise<any>
        /*return Promise.resolve()
        .then(async () => {
        })*/
    }

    public destroyToken(id : string)
    {
        return new Promise((resolve, reject) => {
            if(id)
            {
                this.redis.del(id)
                .then(_data =>{
                    resolve({destroy:true})
                    return
                })
                .catch(e =>{
                    resolve(null)
                    return
                })
            }
            resolve(null)
            return
        })as Promise<any>
        /*return Promise.resolve()
        .then(async () => {
        })*/
    }
}
// verifyToken = (req, res, next) => {
//     let token = req.headers["x-access-token"];
//     if (!token) {
//       return res.status(403).send({
//         message: "No token provided!"
//       });
//     }
//     jwt.verify(token, config.secret, (err, decoded) => {
//       if (err) {
//         return res.status(401).send({
//           message: "Unauthorized!"
//         });
//       }
//       req.email = decoded.id;
//       next();
//     });
//   };