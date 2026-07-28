const express = require('express');
const cors = require('cors');
const path = require('path');

const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

const app = express();
app.use(cors());

// Serve all static config scripts (uv.bundle.js, uv.sw.js) smoothly out of root directory memory
app.use(express.static(__dirname));

// 1. WILDCARD PARAMETER DECODER TUNNEL: Explicitly processes Ultraviolet's Base64 token strings
app.get('/service/*', async (req, res) => {
    // Extracts everything after the "/service/" prefix out of the request params matrix
    let token = req.params[0] || '';
    if (!token) return res.status(400).send("No target token specified.");

    try {
        // Automatically translate Ultraviolet's Base64 string back into a standard URL string
        let targetUrl = Buffer.from(token, 'base64').toString('utf-8');

        if (!targetUrl.startsWith('http')) {
            targetUrl = 'https://' + targetUrl;
        }

        const urlObj = new URL(targetUrl);
        const options = {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        };

        const response = await fetch(targetUrl, options);
        let contentType = response.headers.get('content-type') || '';

        // Pass binary streaming assets (video data tracks, scripts, styling, images) straight through the domain
        if (!contentType.includes('text/html')) {
            const dataBuffer = await response.buffer();
            res.setHeader('Content-Type', contentType);
            return res.send(dataBuffer);
        }

        let htmlContent = await response.text();

        // INJECTION MASK: Inject base path anchors so dynamic sub-scripts pull data seamlessly
        const injectionBase = `<head><base href="${urlObj.origin}/"><script>
            (function() {
                try {
                    // Paralyze frame breakout parameters to freeze browser navigation loops completely
                    Object.defineProperty(window, 'top', { value: window, configurable: false, writable: false });
                    Object.defineProperty(window, 'parent', { value: window, configurable: false, writable: false });
                } catch(e) {}
            })();
        <\/script>`;
        
        htmlContent = htmlContent.replace(/<head>/i, injectionBase);
        htmlContent = htmlContent.replace(/content-security-policy/gi, 'disabled-csp');
        htmlContent = htmlContent.replace(/x-frame-options/gi, 'disabled-xfo');

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
        res.send(htmlContent);

    } catch (err) {
        res.status(500).send(`<h3>Proxy Server Pipeline Connection Fault:</h3><p>${err.message}</p>`);
    }
});

// 2. INTERFACE RENDER LANE: Serves the clean frontend layout file directly
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Unrestricted Token Proxy live on port ${PORT}`));
