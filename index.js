const express = require('express');
const path = require('path');
const app = express();

// Serve the static engine files smoothly out of the root directory lanes
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    const activeAssignment = req.query.assignment || '';
    const activeSearch = req.query.q || '';

    let bannerStyle = "display: none;";
    let bannerText = "";
    let headerText = "General Database Search Gateway";

    if (activeAssignment) {
        bannerStyle = "display: inline-block;";
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
                .view-panel { display: ${activeSearch ? 'block' : 'none'}; width: 100%; height: 100%; border: none; box-sizing: border-box; position: fixed; top: 0; left: 0; z-index: 1000; background: #fff; }
                iframe { width: 100%; height: 100%; border: none; margin: 0; padding: 0; }
                #result-link { margin-top: 25px; padding: 15px; background: #f0f7ff; border: 1px solid #bae7ff; border-radius: 8px; display: none; word-break: break-all; font-size: 14px; }
            </style>
            <!-- Pre-load Ultraviolet initialization components safely -->
            <script src="/uv.config.js"></script>
        </head>
        <body>
            <div id="viewPanel" class="view-panel">
                <iframe id="proxyIframe" src="${activeSearch ? '/service/' + encodeURIComponent(decodeURIComponent(activeSearch)) : ''}"></iframe>
            </div>
            <div id="mainUI" class="app-container">
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
                // Formally registers the server worker container loop directly inside browser tab memory
                if ('serviceWorker' in navigator) {
                    window.navigator.serviceWorker.register('/uv.sw.js', { scope: __uv$config.prefix });
                }

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Unrestricted Viewport Matrix running on port ${PORT}`));
