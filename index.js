const express = require('express');
const cors = require('cors');
const path = require('path');

const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

const app = express();
app.use(cors());

// 1. DYNAMIC GATEWAY LANE: Catch and process the query stream before checking flat filesystem records
app.get('/service', async (req, res) => {
    let targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send("No target site URL specified.");

    try {
        // Parse raw string components inside secure server-side container memory
        targetUrl = decodeURIComponent(targetUrl);
        const urlObj = new URL(targetUrl);
        
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

        // Seamlessly pass binary elements (video fragments, script modules, styling, fonts)
        if (!contentType.includes('text/html')) {
            const dataBuffer = await response.buffer();
            res.setHeader('Content-Type', contentType);
            return res.send(dataBuffer);
        }

        let htmlContent = await response.text();

        // DEFEAT SAME-ORIGIN SECURITY: Inject an internal base path tag so styling and assets resolve natively
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
        res.status(500).send(`<h3>Proxy Server Connection Fault:</h3><p>${err.message}</p>`);
    }
});

// 2. INTERFACE RENDER LANE: Serves the clean frontend layout file directly
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Static fallback directory mapper configuration
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Unrestricted Proxy Tunnel live on port ${PORT}`));
