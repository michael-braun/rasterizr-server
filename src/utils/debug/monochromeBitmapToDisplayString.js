export default function monochromeBitmapToDisplayString(buffer, metadata) {
    const lineLength = Math.floor((metadata.width + 7) / 8);

    let string = '';
    for (let y = 0, yz = metadata.height; y < yz; y++) {
        for (let x = 0, xz = metadata.width; x < xz; x++) {
            const i = (y * lineLength * 8) + x;
            const iMod = i % 8;
            const idx = Math.floor(i / 8);

            if (buffer[idx] & (1 << (7 - iMod))) {
                string += '1';
            } else {
                string += ' ';
            }
        }

        const offset = (lineLength * 8) - metadata.width;
        if (offset) {
            for (let j = 0; j < offset; j++) {
                string += ' ';
            }
        }

        string += '\n';
    }

    return string;
}
