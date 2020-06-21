import { performance } from 'perf_hooks';

import LogHelper from './LogHelper';

const IconLogMiddleware = (extension) => async (ctx, next) => {
    if (!ctx.params.library || !ctx.state.icon?.name) {
        return next();
    }

    const start = performance.now();
    try {
        return await next(ctx);
    } catch (ex) {
        throw ex;
    } finally {
        const diff = performance.now() - start;
        LogHelper.IconRequestLog(ctx.params.library, ctx.state.icon.name, extension, Math.round(diff), ctx.state.icon);
    }
};

export default IconLogMiddleware;
