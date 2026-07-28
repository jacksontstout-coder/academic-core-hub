 const express = require('express');
const cors = require('cors');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());

app.get('/', async (req, res) => {
    const activeAssignment = req.query.assignment || '';
    const activeSearch = req.query.q || '';

    if (activeSearch) {
        let targetUrl = decodeURIComponent(activeSearch);
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Student Workspace Portal - Active Session</title>
                <style>html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #fff; }</style>
            </head>
            <body>
                <iframe src="/stream-gateway?url=${encodeURIComponent(targetUrl)}&assignment=${encodeURIComponent(activeAssignment)}" style="width:100%; height:100%; border:none;" sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts"></iframe>
            </body>
            </html>
        `);
        return;
    }

    let bannerText = "";
    let headerText = "General Database Search Gateway";

    if (activeAssignment) {
        bannerText = `Active Session: ${activeAssignment.toUpperCase()}`;
        headerText = `Research Module: ${activeAssignment.replace(/-/g, ' ').toUpperCase()}`;
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Student Workspace Portal - Academic Database</title>
            <style>
                body, html { margin: 0; padding: 0; width: 100%; height: 100%; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f4f6f9; color: #1e293b; overflow: hidden; }
                .app-container { display: flex; min-height: 100vh; width: 100%; }
                .sidebar { width: 260px; background: #2c3e50; color: white; display: flex; flex-direction: column; padding: 20px; box-sizing: border-box; border-right: 1px solid rgba(255,255,255,0.1); }
                .school-logo { font-size: 18px; font-weight: 800; letter-spacing: 0.5px; padding-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 20px; }
                .nav-item { padding: 12px 15px; border-radius: 6px; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.8); }
                .nav-item.active { background: #34495e; color: white; }
                .main-content { flex: 1; padding: 40px; box-sizing: border-box; overflow-y: auto; display: flex; flex-direction: column; gap: 30px; }
                .header-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; position: relative; overflow: hidden; }
                .header-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: #0070f3; }
                .status-badge { display: ${activeAssignment ? 'inline-block' : 'none'}; padding: 4px 12px; font-size: 12px; font-weight: 700; border-radius: 20px; background: #dcfce7; color: #15803d; margin-bottom: 12px; text-transform: uppercase; }
                .card-title { margin: 0 0 8px 0; font-size: 24px; color: #2c3e50; }
                .tool-box { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 30px; }
                input[type="text"] { width: 100%; padding: 14px 16px; font-size: 15px; border: 1px solid #e2e8f0; border-radius: 8px; box-sizing: border-box; margin-bottom: 20px; outline: none; background: #f8fafc; color: #1e293b; }
                input[type="text"]:focus { border-color: #0070f3; background: white; }
                .action-btn { display: block; padding: 14px 24px; font-size: 15px; background: #0070f3; color: white; border: none; border-radius: 8px; cursor: pointer; width: 100%; font-weight: 600; box-sizing: border-box; text-align: center; }
                .bot-btn { background: #1e293b; margin-top: 10px; }
                #result-link { margin-top: 25px; padding: 15px; background: #f0f7ff; border: 1px solid #bae7ff; border-radius: 8px; display: none; word-break: break-all; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="app-container">
                <div class="sidebar">
                    <div class="school-logo">CampusWorkspace</div>
                    <div class="nav-item active">Assignment Core</div>
                    <div class="nav-item">Course Modules</div>
                    <div class="nav-item">Grade Book</div>
                </div>
                <div class="main-content">
                    <div class="header-card">
                        <div class="status-badge">${bannerText}</div>
                        <h1 class="card-title">${headerText}</h1>
                    </div>
                    <div class="tool-box">
                        <h3>External Research Engine Tunnel</h3>
                        <p style="color:#64748b; font-size:14px; margin-bottom:20px;">Type any URL or streaming media site below to compile an unblocked proxy pipeline inside this viewport layout.</p>
                        <input type="text" id="urlInput" placeholder="Enter target site here (e.g., google.com, dulo.tv)..." autocomplete="off">
                        <button class="action-btn" id="searchBtn">Execute Research Pipeline</button>
                    </div>
                    <div class="tool-box">
                        <h3>Proxy Dispenser Bot</h3>
                        <button class="action-btn bot-btn" id="cloneBtn">Replicate Workspace Node</button>
                        <div id="result-link"></div>
                    </div>
                </div>
            </div>
            <script>
                document.getElementById('searchBtn').onclick = function() {
                    let target = document.getElementById('urlInput').value.trim();
                    if (!target) return;
                    if (!target.includes('.')) {
                        target = 'https://google.com' + encodeURIComponent(target);
                    } else if (!/^https?:\\/\\//i.test(target)) {
                        target = 'https://' + target;
                    }
                    const subs = ['algebra-workbook', 'geometry-proofs', 'calculus-limits', 'history-archive'];
                    const randomSubject = subs[Math.floor(Math.random() * subs.length)] + '-' + Math.floor(1000 + Math.random() * 9999);
                    window.location.href = '/?assignment=' + randomSubject + '&q=' + encodeURIComponent(target);
                };
                document.getElementById('cloneBtn').onclick = function() {
                    const div = document.getElementById('result-link');
                    div.style.display = "block";
                    const subs = ['algebra-workbook', 'geometry-proofs', 'calculus-limits', 'history-archive'];
                    const randomSubject = subs[Math.floor(Math.random() * subs.length)] + '-' + Math.floor(1000 + Math.random() * 9999);
                    const newLink = window.location.origin + '/?assignment=' + randomSubject;
                    div.innerHTML = '<strong>Generated Node Link:</strong><br><br><a href="' + newLink + '" target="_self" style="color:#0070f3; font-weight:bold; text-decoration:none;">' + newLink + '</a>';
                };
            </script>
        </body>
        </html>
    `);
});

app.get('/stream-gateway', async (req, res) => {
    let targetUrl = req.query.url;
    let assignment = req.query.assignment || '';
    if (!targetUrl) return res.status(400).send("No target site URL specified.");

    try {
        const urlObj = new URL(targetUrl);
        const options = {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.5',
                'Referer': urlObj.origin
            }
        };

        const response = await fetch(targetUrl, options);
        let contentType = response.headers.get('content-type') || '';
        
        if (!contentType.includes('text/html')) {
            const dataBuffer = await response.buffer();
            res.setHeader('Content-Type', contentType);
            return res.send(dataBuffer);
        }

        let htmlContent = await response.text();
        const injectionBase = `<head><base href="${urlObj.origin}/"><script>
            (function() {
                Object.defineProperty(window, 'top', { value: window, configurable: false, writable: false });
                Object.defineProperty(window, 'parent', { value: window, configurable: false, writable: false });
                window.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const form = e.target;
                    if (form.action) {
                        window.parent.location.href = window.location.origin + '/?assignment=${assignment}&q=' + encodeURIComponent(form.action);
                    }
                }, true);
            })();
        </script>`;
        
        htmlContent = htmlContent.replace(/<head>/i, injectionBase);
        htmlContent = htmlContent.replace(/content-security-policy/gi, 'disabled-csp');
        htmlContent = htmlContent.replace(/x-frame-options/gi, 'disabled-xfo');

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
        res.send(htmlContent);
    } catch (err) {
res.status(500).send(<h3>Streaming Proxy Server Error:</h3><p>${err.message}</p>);}});const PORT = process.env.PORT || 3000;app.listen(PORT, () => console.log(Unrestricted Proxy Gateway live on port ${PORT}));
