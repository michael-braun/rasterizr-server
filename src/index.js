import Koa from 'koa';
import Router from '@koa/router';
import path from 'path';
import bodyparser from 'koa-bodyparser';

import * as swagger from 'swagger2';
import { ui } from 'swagger2-koa';

import registerRasterizationRoutes from './controller/rasterizations';

const app = new Koa();
const router = new Router();

// SETUP swagger-middleware
const document = swagger.loadDocumentSync(path.resolve(__dirname, 'openapi.yml'));
app.use(ui(document, '/swagger'));

// SETUP bodyparser
app.use(bodyparser());

// SETUP routes
registerRasterizationRoutes(router);

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(process.env.PORT || 8080);
