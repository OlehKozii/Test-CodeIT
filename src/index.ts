import * as dotenv from "dotenv";
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });

import express, { Express, NextFunction, Response, Request } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import requestIp from "request-ip";
import swaggerUi from "swagger-ui-express";

import router from "./router/router";
import sequelize from "./data-source";
import errorHandler from "./middleware/errorHandlerMiddleware";
import * as path from "path";
import * as SwaggerJson from "./swagger.json";

const app: Express = express();

const port: Number = Number(process.env.PORT);

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(
  "/api/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(SwaggerJson, { explorer: true })
);
app.use(requestIp.mw());
app.use(express.static(path.join(__dirname, "../front")));
app.use("/api", (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.originalUrl} from ${req.clientIp}`);
  next();
});
app.use("/api", router);
app.use(errorHandler);

const start = async () => {
  await sequelize.authenticate();
  await sequelize.sync();
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

start().then();
