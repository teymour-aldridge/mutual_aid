import {app, jsonParser, SECRET_KEY} from "./index";
import {SimpleHelp, User} from "./models";
import {authenticationError, databaseError} from "./errors";
import sequelize, {Op} from "sequelize";
import jwt from "express-jwt";

export default function (app) {
    app.post('/simplehelp/create', jwt({secret: SECRET_KEY, algorithms: ["HS256"]}), jsonParser, (req, res) => {
        let userId = req.user.id;
        console.log(userId);
        if (!userId) {
            authenticationError(res);
            return;
        }
        let description = req.body.description;
        let latitude = req.body.latitude;
        let longitude = req.body.longitude;

        User.findOne({
            where: {
                id: userId
            }
        }).then(user => {
            SimpleHelp.create({
                requestingUser: userId,
                description,
                fulfillingUser: null,
                latitude,
                longitude
            }).then(help => {
                res.status(200);
                res.json({
                    id: help.id
                })
            }).catch(error => {
                console.log(error);
                databaseError(error, res)
            });
        }).catch(error => {
            console.log(error);
            databaseError(error, res);
        });
    });

    app.post('/simplehelp/list', jwt({secret: SECRET_KEY, algorithms: ["HS256"]}), jsonParser, (req, res) => {
        let userId = req.user.id;
        let latitude = req.body.latitude;
        let longitude = req.body.longitude;
        if (!userId) {
            authenticationError(res);
            return;
        }
        User.findByPk(userId).then(user => {
            SimpleHelp.findAll({
                // blatantly stole this from
                // https://stackoverflow.com/questions/44012932/sequelize-geospatial-query-find-n-closest-points-to-a-location
                attributes: [[sequelize.literal("6371 * acos(cos(radians(" + latitude + ")) * cos(radians(latitude)) * " +
                    "cos(radians(" + longitude + ") - radians(longitude)) + sin(radians(" + latitude + ")) * " +
                    "sin(radians(latitude)))"), 'distance'], "description", "id"],
                order: sequelize.col('distance'),
                limit: 10,
                where: {
                    id: {
                        [Op.ne]: userId
                    },
                    fulfillingUser: {
                        [Op.eq]: null
                    }
                }
            }).then(helps => {
                res.json({
                    "data": helps
                })
            }).catch(error => {
                console.log(error);
                databaseError(error, res)
            });
        }).catch(error => {
            databaseError(error, res)
        });

    });
    app.post("/simplehelp/fulfill/:simpleHelpId", jwt({
        secret: SECRET_KEY,
        algorithms: ["HS256"]
    }), jsonParser, (req, res) => {
        let userId = req.user.id;
        let simpleHelpId = req.params["simpleHelpId"];
        SimpleHelp.findByPk(simpleHelpId).then(simpleHelp => {
            simpleHelp.update({fulfillingUserId: userId}).then(() => {
                res.status(200);
            }).catch(error => {
                databaseError(error, res)
            });
        }).catch(error => {
            databaseError(error, res);
        });
    })
    app.post("/simplehelp/rescind/:simpleHelpId", jwt({
        secret: SECRET_KEY,
        algorithms: ["HS256"]
    }), jsonParser, (req, res) => {
        let userId = req.user.id;
        let simpleHelpId = req.params["simpleHelpId"];
        SimpleHelp.findByPk(simpleHelpId).then(simpleHelp => {
            if (simpleHelp.getDataValue("fulfillingUserId") === userId) {
                SimpleHelp.destroy({
                    where: {
                        id: simpleHelpId
                    }
                }).then(() => {
                    res.status(200).json({
                        success: true
                    })
                }).catch(error => {
                    databaseError(error, res);
                })
            } else {
                res.status(403).json({
                    "cause": "You have not accepted that request.",
                    "fix": "You may only rescind offers that you have already made."
                })
            }
        }).catch(error => {
            databaseError(error, res);
        })
    })
    app.post("/simplehelp/currentlyFulfilling", jwt({
        secret: SECRET_KEY,
        algorithms: ["HS256"]
    }), jsonParser, (req, res) => {
        let userId = req.user.id;
        SimpleHelp.findAll({
            where: {
                fulfillingUserId: userId
            }
        }).then(result => {
            res.status(200).json({
                data: result
            })
        }).catch(error => {
            databaseError(error, res);
        })
    })
}

