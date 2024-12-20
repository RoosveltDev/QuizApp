/**
 * Setup express server.
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import logger from 'jet-logger';
import http from 'http';
import 'express-async-errors';
import BaseRouter from './routes/api';
import Paths from './routes/constants/Paths';
import EnvVars from './constants/EnvVars';
import HttpStatusCodes from './constants/HttpStatusCodes';
import { NodeEnvs } from './constants/misc';
import { RouteError } from './other/classes';

// **** Variables **** //

const app = express();
const server = http.createServer(app);

// **** Setup **** //

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser(EnvVars.CookieProps.Secret));

if (EnvVars.NodeEnv === NodeEnvs.Dev) {
  app.use(morgan('dev'));
}

if (EnvVars.NodeEnv === NodeEnvs.Production) {
  app.use(helmet());
}

app.use(Paths.Base, BaseRouter);

app.use(
  (
    err: Error,
    _: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (EnvVars.NodeEnv !== NodeEnvs.Test) {
      logger.err(err, true);
    }
    let status = HttpStatusCodes.BAD_REQUEST;
    if (err instanceof RouteError) {
      status = err.status;
    }
    return res.status(status).json({ error: err.message });
  }
);

// **** Export Default **** //
export default server;
