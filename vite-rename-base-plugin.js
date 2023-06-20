export default function renameBase(name) {
    return {
        name: 'rename-base',
        enforce: 'post',
        config(config) {
            config.base = name;
        },
    };
}
