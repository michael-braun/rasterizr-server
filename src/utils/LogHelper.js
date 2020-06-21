export default class LogHelper {
    static IconRequestLog(library, iconName, extension, time, icon) {
        const options = [];

        if (icon.options.w && icon.options.h) {
            options.push(`w=${icon.options.w},h=${icon.options.h}`);
        } else if (icon.options.s) {
            options.push(`s=${icon.options.s}`);
        }

        const optionsString = (options.length ? ` - ${options.join()}` : '');
        console.log(`[REQUEST] ${library} - ${iconName} (${extension}, ${time}ms)${optionsString}`);
    }
}
