import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import sharp from 'sharp';
import Jimp from 'jimp';
import calculateMetadata from './calculateMetadata';

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
        const data = (await this.#getSharp(options))
            .png();

        const metaData = data.metadata();
        const buffer = data.toBuffer();

        return {
            metadata: calculateMetadata(await metaData, options),
            buffer: await buffer,
        };
    }

    async toWebP(options) {
        const data = (await this.#getSharp(options))
            .webp();

        const metaData = data.metadata();
        const buffer = data.toBuffer();

        return {
            metadata: calculateMetadata(await metaData, options),
            buffer: await buffer,
        };
    }

    async toBMP(options) {
        const pngData = await this.toPNG(options);

        const image = await Jimp.read(pngData.buffer);
        image.background(0xFFFFFFFF);
        return {
            metadata: pngData.metadata,
            buffer: await image.getBufferAsync(Jimp.MIME_BMP),
        };
    }

    async toMonochromeBitmap(options) {
        const imageData = (await this.#getSharp(options))
            .threshold()
            .ensureAlpha()
            .extractChannel(3)
            .toColorspace('b-w')
            .raw();

        const [buffer, realMetadata] = await Promise.all([
            imageData.toBuffer(),
            imageData.metadata(),
        ]);
        const metadata = calculateMetadata(realMetadata, options);


        let lineLength = Math.ceil(metadata.width / 8) * 8;
        const lineByteLength = Math.floor((metadata.width + 7) / 8);

        const minBuffer = Buffer.alloc((metadata.height * lineLength) / 8, 0, 'binary');
        let idx = -1;
        for (let y = 0, yz = metadata.height; y < yz; y++) {
            for (let x = 0, xz = metadata.width; x < xz; x++) {
                const sourceI = (y * metadata.width) + x;
                const targetI = (y * lineByteLength * 8) + x;

                if (targetI % 8 === 0) {
                    idx++;
                }

                if (buffer[sourceI] >= 127) {
                    minBuffer[idx] |= (1 << (7 - (targetI % 8)));
                }
            }
        }

        return {
            metadata: metadata,
            buffer: minBuffer,
        };
    }
}
