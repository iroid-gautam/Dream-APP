import express from "express";
import { serve, setup } from "swagger-ui-express";
import { apiBaseUrl } from "../constants/constant";
import YAML from "yamljs";

const router = express.Router();
const swaggerDoc = YAML.load("swagger.yaml");

if(process.env.ENV !== "production") {
    router.use(
        "/",
        (req, res, next) => {
            swaggerDoc.info.title = process.env.APP_NAME;
            swaggerDoc.servers = [
              {
                url: apiBaseUrl(),
                description: "Base url for API's",
              },
            ];
            req.swaggerDoc = swaggerDoc;
            next();
          },
          serve,
          setup(swaggerDoc, {
            swaggerOptions: {
              persistAuthorization: true,
            },
          })
    )
}

export default router;