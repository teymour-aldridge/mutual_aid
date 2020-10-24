import {jsonParser, SECRET_KEY} from "./index.js";
import jwt from "express-jwt";
import {ComplexHelp, ComplexHelpLocation} from "./models.js";
import sequelize from "sequelize";
import {authenticationError, databaseError, notAllParametersSupplied} from "./errors.js";
import {Op} from "sequelize";

export default function (app) {
    app.post("/complexhelp/create", jsonParser, jwt({secret: SECRET_KEY, algorithms: ["HS256"]}),
        (req, res) => {
            let description = req.body.description;
            let steps = req.body.steps;
            let userId = req.user.id;
            ComplexHelp.create({
                requestingUserId: userId,
                description,
                completed: false
            }).then(complexHelp => {
                ComplexHelpLocation.bulkCreate(steps.map(step => {
                    return {
                        complexHelpId: complexHelp.id,
                        ...step
                    }
                })).then(() => {
                    res.status(200).json({"success": true});
                }).catch(error => {
                    databaseError(error, res);
                });
            }).catch(error => {
                databaseError(error, res);
            });
        });
    app.post("/complexhelp/list", jsonParser, jwt({secret: SECRET_KEY, algorithms: ["HS256"]}), (req, res) => {
        let latitude = req.body.latitude;
        let longitude = req.body.longitude;
        if (!latitude || !longitude) {
            notAllParametersSupplied(res);
        }
        let userId = req.user.id;
        ComplexHelpLocation.findAll({
            attributes: [[sequelize.literal("6371 * acos(cos(radians(" + latitude + ")) * cos(radians(" + latitude + ")) * " +
                "cos(radians(" + longitude + ") - radians(" + longitude + ")) + sin(radians(" + latitude + ")) * " +
                "sin(radians(" + latitude + ")))"), 'distance'], "id", "latitude", "longitude"],
            where: {
                step: 0,
            },
            include: [{
                model: ComplexHelp,
                where: {
                    requestingUserId: {
                        [Op.ne]: userId
                    }
                }
            }]
        }).then(data => {
            res.status(200).json({
                data: data.map(item => {
                    return {
                        ...item.ComplexHelp.dataValues,
                        latitude: parseFloat(item.getDataValue("latitude")),
                        longitude: parseFloat(item.getDataValue("longitude"))
                    }
                })
            });
        }).catch(error => {
            databaseError(error, res);
        });
    });
    app.post("/complexhelp/complete/:complexHelpId", jsonParser, jwt({
        secret: SECRET_KEY,
        algorithms: ["HS256"]
    }), (req, res) => {
        let userId = req.user.id;
        let complexHelpId = req.params["complexHelpId"];
        ComplexHelp.findByPk(complexHelpId).then(complexHelp => {
            if (complexHelp.fulfillingUserId === userId) {
                ComplexHelp.update({completed: true}, {
                    where: {
                        id: complexHelp.id
                    }
                }).then(() => {
                    res.status(200).json({success: true});
                }).catch(error => {
                    databaseError(error);
                });
            } else {
                authenticationError(res);
            }
        }).catch(error => {
            databaseError(error);
        })
    });
    app.post("/complexhelp/provide/:complexHelpId", jsonParser, jwt({
        secret: SECRET_KEY,
        algorithms: ["HS256"]
    }), (req, res) => {
        let userId = req.user.id;
        let complexHelpId = req.params.complexHelpId;
        ComplexHelp.findByPk(complexHelpId).then(complexHelp => {
            complexHelp.update({
                fulfillingUserId: userId
            }).then(() => {
                res.status(200).json({success: true});
            }).catch(error => {
                databaseError(error);
            });
        }).catch(error => {
            databaseError(error, res);
        })
    });
    app.post("/complexhelp/rescind/:complexHelpId", jsonParser, jwt({
        secret: SECRET_KEY,
        algorithms: ["HS256"]
    }), (req, res) => {
        let userId = req.user.id;
        let complexHelpId = req.params["complexHelpId"];
        ComplexHelp.findByPk(complexHelpId).then(complexHelp => {
            if (complexHelp.getDataValue("requestingUserId") === userId || complexHelp.getDataValue("fulfillingUserId") === userId) {
                ComplexHelp.destroy({
                    where: {
                        id: complexHelpId
                    }
                }).then(() => {
                    res.status(200).json({success: true});
                }).catch(error => {
                    databaseError(error, res);
                })
            }
        }).catch(error => {
            databaseError(error, res)
        })
    });
    app.post("/complexhelp/myHelpRequests", jsonParser, jwt({
        secret: SECRET_KEY,
        algorithms: ["HS256"]
    }), (req, res) => {
        let userId = req.user.id;
        ComplexHelp.findAll({
            where: {
                requestingUserId: userId
            }
        }).then(data => {
            res.status(200).json(data);
        }).catch(error => {
            databaseError(error);
        })
    });
}
