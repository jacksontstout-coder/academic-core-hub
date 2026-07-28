const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Allow unrestricted asynchronous cross-origin asset downloads across our framework lanes
app.use(cors());
app.use(express.static(__dirname));

// FRONT-END VIEW CONTROLLER: Securely serves your index.html layout file without memory manipulation
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// BACKEND ROUTING ENGINE: Explicitly handles parameter processing using a direct property search
app.get('/service/*', async (req, res) => {
    // FIX: Extracts the raw path string parameter by explicitly reading the array index key
    const wildcardPath = req.params[0];
    if (!wildcardPath) return res.status(400).send("No target site URL specified.");

    try {
        // Automatically translate incoming URL-hex structures inside server memory
        let targetUrl = decodeURIComponent(wildcardPath);

        if (!/^https?:\/\//i.test(targetUrl)) {
            targetUrl = 'https://' + targetUrl;
        }

        const urlObj = new URL(targetUrl);
        const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

        const options = {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Origin': urlObj.origin,
                'Referer': urlObj.origin
            }
        };

        const response = await fetch(targetUrl, options);
        let contentType = response.headers.get('content-type') || '';

        // Safely pass streaming binary assets (videos, files, graphics) straight through the domain
        if (!contentType.includes('text/html')) {
            const dataBuffer = await response.buffer();
            res.setHeader('Content-Type', contentType);
            return res.send(dataBuffer);
        }

        let htmlContent = await response.text();

        // INJECTION MASK: Inject base path anchors so dynamic sub-scripts pull data seamlessly
        const injectionBlock = `<head><base href="${urlObj.origin}/"><script>
            (function() {
                // Freeze the window navigation variables to stop frame breakouts completely
                try {
                    Object.defineProperty(window, 'top', { value: window, configurable: false, writable: false });
                    Object.defineProperty(window, 'parent', { value: window, configurable: false, writable: false });
                } catch(e) {}
            })();
        <\/script>`;

        htmlContent = htmlContent.replace(/<head>/i, injectionBlock);

        // Delete restrictive frame locks and network blocks on the server layer before passing data to screen
        htmlContent = htmlContent.replace(/content-security-policy/gi, 'disabled-csp');
        htmlContent = htmlContent.replace(/x-frame-options/gi, 'disabled-xfo');

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
        
        res.send(htmlContent);

    } catch (err) {
        res.status(500).send(`<h3>Proxy Server Pipeline Exception:</h3><p>${err.message}</p>`);
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Unrestricted Proxy Gateway live on port ${PORT}`));
