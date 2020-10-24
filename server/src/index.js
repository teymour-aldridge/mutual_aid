/**
 * Starts the server.
 */
import express from "express";
import bodyParser from "body-parser";
export const jsonParser = bodyParser.json();
export const app = express();
const port = process.env.PORT ? process.env.PORT : 8080;
import authRoutes from "./auth.js";
import simpleHelpRoutes from "./simpleHelp.js";
import {sequelize} from "./models.js";
import complexHelp from "./complexHelp.js";

export const SECRET_KEY = process.env.SECRET_KEY || "!@afdsjg3worrewrjkt23o4rewkltj43kjregw;eklgewgrekjfdbfdng";

const expiryDate = new Date(Date.now() + 60 * 60 * 1000);

app.use(express.static("build"));

authRoutes(app);
simpleHelpRoutes(app);
complexHelp(app);

sequelize.sync().then(
    () => {
        app.listen(port, () => {
            console.log(`Server listening at http://localhost:${port}`);
        });
    }
);
