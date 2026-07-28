// Ultraviolet In-Memory Network Traffic Tap
importScripts('./uv.bundle.js');

self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    const url = req.url;
    
    // Catch any hidden network traffic strings passing through the educational prefix route
    if (url.startsWith(self.location.origin + window.__uv$config.prefix)) {
        const encryptedTarget = url.split(window.__uv$config.prefix).pop();
        const cleanTarget = window.__uv$config.decodeUrl(encryptedTarget);
        
        // Directs asset request chains securely through the bare proxy routing lane
        event.respondWith(
            fetch(window.__uv$config.bare + 'v1/?url=' + encodeURIComponent(cleanTarget), {
                method: req.method,
                headers: req.headers,
                body: req.body
            })
        );
    }
});
