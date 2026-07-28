self.__uv$config = {
    prefix: '/service/',
    bare: 'https://bennett.is', // Public high-speed traffic processing link
    encodeUrl: function(url) {
        return encodeURIComponent(url);
    },
    decodeUrl: function(url) {
        return decodeURIComponent(url);
    },
    handler: '/uv.handler.js',
    bundle: '/uv.bundle.js',
    config: '/uv.config.js',
    sw: '/uv.sw.js'
};
