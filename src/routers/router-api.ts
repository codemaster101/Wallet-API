import express from 'express';
import * as core from 'express-serve-static-core';
import RouterV1 from './v1/router-version1';

const RouterApi: core.Router = express.Router({ mergeParams: true });

RouterApi.use('/v1', RouterV1);

export default RouterApi;
