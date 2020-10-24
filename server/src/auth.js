import {jsonParser, SECRET_KEY} from "./index.js";
import {Op} from "sequelize";
import {saltRounds, User} from "./models.js";
import {databaseError, notAllParametersSupplied} from "./errors.js";
import jwt from "jsonwebtoken";
import bcrypt from "node-bcrypt";

/**
 * Why does this language not have integers?
 */
function signJWT(res, user) {
    res.status(200).json({
        "data": jwt.sign({id: user.id}, SECRET_KEY)
    });
}

export default function (app) {
    app.post('/auth/login', jsonParser, (req, res) => {
        let usernameOrEmail = req.body.identifier;
        let password = req.body.password;
        if (!usernameOrEmail || !password) {
            notAllParametersSupplied(res);
            return;
        }
        User.findOne({
            where: {
                [Op.or]: {
                    email: usernameOrEmail,
                    username: usernameOrEmail
                }
            }
        }).then(user => {
            if (user.checkPassword(password)) {
                signJWT(res, user);
            } else {
                res.status(403).json({
                    "cause": "The password you have supplied is incorrect.",
                    "fix": "Check that your password is correct."
                });
            }
        }).catch(error => {
            databaseError(error, res);
        });
    });

    app.post('/auth/register', jsonParser, (req, res) => {
        let username = req.body.username;
        let password = req.body.password;
        let email = req.body.email;
        if (!username || !password || !email) {
            notAllParametersSupplied(res);
            return;
        }
        bcrypt.hash(password, saltRounds).then(password => {
            User.create({username, email, password}).then(user => {
                signJWT(res, user);
            }).catch(error => {
                databaseError(error, res);
            })
        }).catch(() => {
            res.status(500).json({
                "cause": "Something went wrong when encrypting your password.",
                "fix": "Please get in touch with the programmers (you are well within your rights to shout at them," +
                    "loudly)."
            });
        });
    });
}
