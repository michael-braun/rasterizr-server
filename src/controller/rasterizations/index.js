import Rasterizr from '../../utils/Rasterizr';
import FilenameMiddleware from '../../utils/FilenameMiddleware';
import IconLogMiddleware from '../../utils/IconLogMiddleware';

export default function registerRasterizationRoutes(router) {
    router.get('/rasterizations/:library/:icon.png', FilenameMiddleware(), IconLogMiddleware('png'), async (ctx) => {
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

    router.get('/rasterizations/:library/:icon.webp', FilenameMiddleware(), IconLogMiddleware('webp'), async (ctx) => {
        const rasterizr = await Rasterizr.Get(ctx.params.library, ctx.state.icon.name);

        if (!rasterizr) {
            ctx.status = 404;
            return;
        }

        const { buffer, metadata } = await rasterizr.toWebP({
            width: parseInt(ctx.state.icon.options.w, 10) || null,
            height: parseInt(ctx.state.icon.options.h, 10) || null,
            size: parseInt(ctx.state.icon.options.s, 10) || null,
        });

        ctx.body = buffer;

        ctx.set('Content-Type', 'image/webp');
        ctx.set('X-Image-Width', metadata.width);
        ctx.set('X-Image-Height', metadata.height);

        ctx.status = 200;
    });

    router.get('/rasterizations/:library/:icon.bmp', FilenameMiddleware(), IconLogMiddleware('bmp'), async (ctx) => {
        const rasterizr = await Rasterizr.Get(ctx.params.library, ctx.state.icon.name);

        if (!rasterizr) {
            ctx.status = 404;
            return;
        }

        const { buffer, metadata } = await rasterizr.toBMP({
            width: parseInt(ctx.state.icon.options.w, 10) || null,
            height: parseInt(ctx.state.icon.options.h, 10) || null,
            size: parseInt(ctx.state.icon.options.s, 10) || null,
        });

        ctx.body = buffer;

        ctx.set('Content-Type', 'image/bmp');
        ctx.set('X-Image-Width', metadata.width);
        ctx.set('X-Image-Height', metadata.height);

        ctx.status = 200;
    });

    router.get('/rasterizations/monochrome-bitmaps/:library/:icon.raw', FilenameMiddleware(), IconLogMiddleware('arduino-raw'), async (ctx) => {
        const rasterizr = await Rasterizr.Get(ctx.params.library, ctx.state.icon.name);

        if (!rasterizr) {
            ctx.status = 404;
            return;
        }

        const { buffer, metadata } = await rasterizr.toMonochromeBitmap({
            width: parseInt(ctx.state.icon.options.w, 10) || null,
            height: parseInt(ctx.state.icon.options.h, 10) || null,
            size: parseInt(ctx.state.icon.options.s, 10) || null,
        });

        ctx.body = buffer;

        ctx.set('Content-Type', 'application/octet-stream');
        ctx.set('X-Image-Width', metadata.width);
        ctx.set('X-Image-Height', metadata.height);

        ctx.status = 200;
    });
}
