// Ultraviolet Core Interception & Asset Rewriting Bundle
(function() {
    'use strict';
    const prefix = '/service/';
    window.__uv$config = {
        prefix: prefix,
        bare: 'https://bennett.is', // High-speed serverless traffic lane
        encodeUrl: function(url) { return btoa(url).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); },
        decodeUrl: function(url) { return atob(url.replace(/-/g, '+').replace(/_/g, '/')); },
        handler: '/uv.handler.js',
        bundle: '/uv.bundle.js',
        config: '/uv.config.js',
        sw: '/uv.sw.js'
    };
    console.log("Ultraviolet Engine Inversion Active.");
})();
