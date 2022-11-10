module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        "stream": require.resolve("stream-browserify")
    });
    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([]);
    return config;
}
