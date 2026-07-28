const express = require('express');
const cors = require('cors');
const path = require('path');

const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

const app = express();
app.use(cors());

// Securely serve all raw static asset scripts (uv.bundle.js, uv.sw.js) natively out of memory
app.use(express.static(__dirname));

// 1. ADVANCED REWRITING TUNNEL: Explicitly captures, decodes, and routes Ultraviolet's background stream traffic
app.get('/service/*', async (req, res) => {
    // Safely extracts the trailing path block token from the Express wildcard array index
    let wildcardPath = req.params[0] || '';
    if (!wildcardPath) return res.status(400).send("No target site URL specified.");

    try {
        // Ultraviolet passes encoded/scrambled URLs. We decode them here inside server memory.
        let targetUrl = Buffer.from(decodeURIComponent(wildcardPath), 'base64').toString('utf-8');

        if (!targetUrl.startsWith('http')) {
            targetUrl = 'https://' + targetUrl;
        }

        const urlObj = new URL(targetUrl);
        
        // Formulate a clean header spoof array layer to blind target firewall filters
        const options = {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.5',
                'Origin': urlObj.origin,
                'Referer': urlObj.origin
            }
        };

        const response = await fetch(targetUrl, options);
        let contentType = response.headers.get('content-type') || '';

        // Seamlessly pass binary elements (video fragments for dulo.tv, live scripts, images, styling fonts)
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

// 2. FRONTEND VIEW CONTROL: Serves your authentic student dashboard interface layout file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Unrestricted Service Worker Tunnel operating live on port ${PORT}`));
