import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import sharp from 'sharp';
import Jimp from 'jimp';

const access = promisify(fs.access);

export default class Rasterizr {
    static async Get(library, icon) {
        const rasterizr = new Rasterizr(library, icon);

        if (!(await rasterizr.exists())) {
            return null;
        }

        return rasterizr;
    }

    #library;

    #icon;

    constructor(library, icon) {
        this.#library = library;
        this.#icon = icon;
    }

    get sourcePath() {
        if (process.env.DATA_DIR) {
            return path.resolve(process.env.DATA_DIR, this.#library, `${this.#icon}.svg`);
        }

        return path.resolve(__dirname, '..', '..', 'data', this.#library, `${this.#icon}.svg`);
    }

    async exists() {
        try {
            await access(this.sourcePath);
            return true;
        } catch (ex) {
            return false;
        }
    }

    #getSharp = async (options) => {
        const sharpOptions = {};

        if (options.width || options.height || options.size) {
            sharpOptions.density = Math.max(
                (options.width || 0) + 50,
                (options.height || 0) + 50,
                (options.size || 0) + 50,
                200,
            ) * 2;
        }

        let sharpInstance = sharp(this.sourcePath, sharpOptions);

        if (options.width || options.height) {
            sharpInstance = sharpInstance.resize(options.width, options.height);
        } else if (options.size) {
            sharpInstance = sharpInstance.resize(options.size);
        }

        return sharpInstance;
    };

    async toPNG(options) {
        return (await this.#getSharp(options))
            .png()
            .toBuffer();
    }

    async toWebP() {
        return (await this.#getSharp(options))
            .webp()
            .toBuffer();
    }

    async toBMP() {
        const pngBuffer = await this.toPNG();

        const image = await Jimp.read(pngBuffer);
        image.background(0xFFFFFFFF);
        return image.getBufferAsync(Jimp.MIME_BMP);
    }

    async toMonochromeBitmap(options) {
        const bufferPromise = (await this.#getSharp(options))
            .threshold()
            .ensureAlpha()
            .extractChannel(3)
            .toColorspace('b-w')
            .raw()
            .toBuffer();
        const buffer = await bufferPromise;

        const minBuffer = Buffer.alloc(Math.ceil(buffer.length / 8), 0, 'binary');
        for (let i = 0, z = buffer.length; i < z; i++) {
            if (buffer[i] > 128) {
                const idx = Math.floor(i / 8);

                minBuffer[idx] |= (1 << (7 - (i % 8)));
            }
        }

        return minBuffer;
    }
}
