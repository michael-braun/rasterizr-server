import Rasterizr from '../../utils/Rasterizr';
import FilenameMiddleware from '../../utils/FilenameMiddleware';

export default function registerRasterizationRoutes(router) {
    router.get('/rasterizations/:library/:icon.png', FilenameMiddleware(), async (ctx) => {
        const rasterizr = await Rasterizr.Get(ctx.params.library, ctx.state.icon.name);

        if (!rasterizr) {
            ctx.status = 404;
            return;
        }

        const { buffer, metadata } = await rasterizr.toPNG({
            width: parseInt(ctx.state.icon.options.w, 10) || null,
            height: parseInt(ctx.state.icon.options.h, 10) || null,
            size: parseInt(ctx.state.icon.options.s, 10) || null,
        });

        ctx.body = buffer;

        ctx.set('Content-Type', 'image/png');
        ctx.set('X-Image-Width', metadata.width);
        ctx.set('X-Image-Height', metadata.height);

        ctx.status = 200;
    });

    router.get('/rasterizations/:library/:icon.webp', FilenameMiddleware(), async (ctx) => {
        const rasterizr = await Rasterizr.Get(ctx.params.library, ctx.state.icon.name);

        if (!rasterizr) {
            ctx.status = 404;
            return;
        }

        ctx.body = await rasterizr.toWebP({
            width: parseInt(ctx.state.icon.options.w, 10) || null,
            height: parseInt(ctx.state.icon.options.h, 10) || null,
            size: parseInt(ctx.state.icon.options.s, 10) || null,
        });
        ctx.set('Content-Type', 'image/webp');

        ctx.status = 200;
    });

    router.get('/rasterizations/:library/:icon.bmp', FilenameMiddleware(), async (ctx) => {
        const rasterizr = await Rasterizr.Get(ctx.params.library, ctx.state.icon.name);

        if (!rasterizr) {
            ctx.status = 404;
            return;
        }

        ctx.body = await rasterizr.toBMP({
            width: parseInt(ctx.state.icon.options.w, 10) || null,
            height: parseInt(ctx.state.icon.options.h, 10) || null,
            size: parseInt(ctx.state.icon.options.s, 10) || null,
        });
        ctx.set('Content-Type', 'image/bmp');

        ctx.status = 200;
    });

    router.get('/rasterizations/monochrome-bitmaps/:library/:icon', FilenameMiddleware(), async (ctx) => {
        const rasterizr = await Rasterizr.Get(ctx.params.library, ctx.state.icon.name);

        if (!rasterizr) {
            ctx.status = 404;
            return;
        }

        ctx.body = await rasterizr.toMonochromeBitmap({
            width: parseInt(ctx.state.icon.options.w, 10) || null,
            height: parseInt(ctx.state.icon.options.h, 10) || null,
            size: parseInt(ctx.state.icon.options.s, 10) || null,
        });
        ctx.set('Content-Type', 'application/octet-stream');

        ctx.status = 200;
    });
}
