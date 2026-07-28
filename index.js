const express = require('express');
const cors = require('cors');
const path = require('path');

const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

const app = express();
app.use(cors(), express.static(__dirname));

// 1. FRONTEND LAYOUT VIEW CONTROL: Serves your index.html file to the browser
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. BACKEND TUNNEL GATEWAY: Explicitly captures, decodes, and streams the live web assets
app.get('/service/*', async (req, res) => {
    // TRIPLE-CHECKED PATCH: Safely extracts the raw wildcard parameter text string via the explicit array index '0'
    let rawPath = req.params[0] || '';
    if (!rawPath) return res.status(400).send("No target site URL specified.");

    // Automatically decode nested url configurations inside active server memory
    let targetUrl = decodeURIComponent(rawPath);

    if (!targetUrl.startsWith('http')) {
        targetUrl = 'https://' + targetUrl;
    }

    try {
        const urlObj = new URL(targetUrl);
        
        // Formulate a robust spoof array layer to bypass security filters and secure cookie walls
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

        // Pass binary streaming elements (videos, audio data tracks, graphics, fonts) straight through the domain
        if (!contentType.includes('text/html')) {
            const dataBuffer = await response.buffer();
            res.setHeader('Content-Type', contentType);
            return res.send(dataBuffer);
        }

        let htmlContent = await response.text();

        // DEFEAT SAME-ORIGIN SECURITY: Inject an internal base path tag so relative styling/scripts resolve cleanly
        const injectionBase = `<head><base href="${urlObj.origin}/"><script>
            (function() {
                try {
                    // Paralyze Google and Bing breakout scripts to freeze navigation loops completely
                    Object.defineProperty(window, 'top', { value: window, configurable: false, writable: false });
                    Object.defineProperty(window, 'parent', { value: window, configurable: false, writable: false });
                } catch(e) {}
            })();
        <\/script>`;
        
        htmlContent = htmlContent.replace(/<head>/i, injectionBase);

        // Delete restrictive frame locks and network blocks on the server layer before passing data to screen
        htmlContent = htmlContent.replace(/content-security-policy/gi, 'disabled-csp');
        htmlContent = htmlContent.replace(/x-frame-options/gi, 'disabled-xfo');

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
        
        res.send(htmlContent);

    } catch (err) {
        res.status(500).send(`<h3>Proxy Server Connection Fault:</h3><p>${err.message}</p>`);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy Node Tunnel running live on port ${PORT}`));
