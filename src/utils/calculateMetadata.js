export default function calculateMetadata(metadata, options) {
    const retVal = {};

    if (options.width && options.height) {
        retVal.width = options.width;
        retVal.height = options.height;
    } else if (options.size) {
        retVal.width = options.size;
        retVal.height = options.size;
    } else {
        retVal.width = metadata.width;
        retVal.height = metadata.height;
    }

    return retVal;
}
