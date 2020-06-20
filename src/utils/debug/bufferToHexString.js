export default function bufferToHexString(buffer) {
    let string = '0x';
    const bufferString = buffer.toString('hex');
    for (let i = 0; i < bufferString.length; i++) {
        if (i % 2 === 0 && i !== 0) {
            string += ", ";
        }

        if (i % 32 === 0 && i !== 0) {
            string += '\n';
        }

        if (i % 2 === 0 && i !== 0) {
            string += "0x";
        }

        string += bufferString[i];
    }

    return string;
}
