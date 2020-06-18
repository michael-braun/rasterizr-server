const FilenameMiddleware = () => (ctx, next) => {
    if (!ctx.params.icon) {
        return next();
    }

    let iconName = '';
    const options = {};
    const parts = ctx.params.icon.split('_');
    parts.forEach((part, index) => {
        if (index === 0) {
            iconName = part;
            return;
        }

        const option = part.split('-');
        if (option.length === 1) {
            options[option[0]] = true;
            return;
        }

        const key = option.shift();
        options[key] = option.join('-');
    });

    ctx.state.icon = {
        name: iconName,
        options: options,
    };
    return next(ctx);
};

export default FilenameMiddleware;
