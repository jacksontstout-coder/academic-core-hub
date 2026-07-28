<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Workspace Portal - Academic Database</title>
    <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f4f6f9; color: #1e293b; overflow: hidden; }
        .app-container { display: flex; min-height: 100vh; width: 100%; }
        .sidebar { width: 260px; background: #2c3e50; color: white; display: flex; flex-direction: column; padding: 20px; box-sizing: border-box; }
        .school-logo { font-size: 18px; font-weight: 800; padding-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 20px; }
        .nav-item { padding: 12px 15px; border-radius: 6px; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.8); }
        .nav-item.active { background: #34495e; color: white; }
        .main-content { flex: 1; padding: 40px; box-sizing: border-box; overflow-y: auto; display: flex; flex-direction: column; gap: 30px; }
        .header-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; position: relative; }
        .header-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: #0070f3; }
        .status-badge { padding: 4px 12px; font-size: 12px; font-weight: 700; border-radius: 20px; background: #dcfce7; color: #15803d; margin-bottom: 12px; text-transform: uppercase; display: none; }
        .card-title { margin: 0 0 8px 0; font-size: 24px; color: #2c3e50; }
        .tool-box { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 30px; }
        input[type="text"] { width: 100%; padding: 14px 16px; font-size: 15px; border: 1px solid #e2e8f0; border-radius: 8px; box-sizing: border-box; margin-bottom: 20px; outline: none; background: #f8fafc; }
        .action-btn { display: block; padding: 14px 24px; font-size: 15px; background: #0070f3; color: white; border: none; border-radius: 8px; cursor: pointer; width: 100%; font-weight: 600; text-align: center; }
        .bot-btn { background: #1e293b; margin-top: 10px; }
        #mirror-box { margin-top: 25px; padding: 15px; background: #f0f7ff; border: 1px solid #bae7ff; border-radius: 8px; display: none; word-break: break-all; font-size: 14px; }
        .view-panel { display: none; width: 100%; height: 100%; position: fixed; top: 0; left: 0; z-index: 1000; background: #fff; }
        iframe { width: 100%; height: 100%; border: none; }
    </style>
</head>
<body>

    <!-- Target Website Viewport Container Layer -->
    <div id="viewPanel" class="view-panel">
        <iframe id="proxyIframe" src=""></iframe>
    </div>

    <div class="app-container">
        <!-- Disguised Sidebar Template -->
        <div class="sidebar">
            <div class="school-logo">CampusWorkspace</div>
            <div class="nav-item active">Assignment Core</div>
            <div class="nav-item">Course Modules</div>
        </div>

        <!-- Main Workspace Controls -->
        <div class="main-content">
            <div class="header-card">
                <div id="statusBadge" class="status-badge">Active Connection</div>
                <h1 id="assignmentHeader" class="card-title">General Database Search Gateway</h1>
            </div>

            <div class="tool-box">
                <h3>External Research Engine Tunnel</h3>
                <input type="text" id="urlInput" placeholder="Enter target site link (e.g., google.com)..." autocomplete="off">
                <button class="action-btn" id="searchBtn">Execute Research Pipeline</button>
            </div>

            <!-- Mirror Generation Component Box -->
            <div class="tool-box">
                <h3>Autonomous Proxy Mirror Dispenser</h3>
                <p style="color:#64748b; font-size:14px; margin-bottom:20px;">Click below to programmatically calculate a new unblocked assignment alias mirror link structure.</p>
                <button class="action-btn bot-btn" id="cloneBtn">🤖 Generate Assignment Mirror URL</button>
                <div id="mirror-box"></div>
            </div>
        </div>
    </div>

    <script>
        const urlParams = new URLSearchParams(window.location.search);
        const activeAssignment = urlParams.get('assignment') || '';
        const activeQuery = urlParams.get('q') || '';

        // If an assignment link was clicked, update the dashboard texts immediately
        if (activeAssignment) {
            document.getElementById('statusBadge').style.display = 'inline-block';
            document.getElementById('statusBadge').innerText = 'Synced Session: ' + activeAssignment.toUpperCase();
            document.getElementById('assignmentHeader').innerText = 'Research Module: ' + activeAssignment.replace(/-/g, ' ').toUpperCase();
        }

        // If a search is active, slide open the iframe securely
        if (activeQuery) {
            document.getElementById('viewPanel').style.display = 'block';
            document.getElementById('proxyIframe').src = '/service/' + encodeURIComponent(decodeURIComponent(activeQuery));
        }

        // Search execution button trigger
        document.getElementById('searchBtn').onclick = function() {
            let target = document.getElementById('urlInput').value.trim();
            if (!target) return;

            if (!target.includes('.')) {
                target = 'https://google.com' + encodeURIComponent(target);
            } else if (!/^https?:\/\//i.test(target)) {
                target = 'https://' + target;
            }

            const modules = ['algebra-workbook', 'geometry-proofs', 'calculus-limits', 'history-archive', 'chemistry-lab'];
            const randomSubject = modules[Math.floor(Math.random() * modules.length)] + '-' + Math.floor(1000 + Math.random() * 9000);
            
            // Reloads the tab path cleanly with the new parameters
            window.location.href = '/?assignment=' + randomSubject + '&q=' + encodeURIComponent(target);
        };

        // FIXED: Click listener cleanly generates the parameterized mirror links
        document.getElementById('cloneBtn').onclick = function() {
            const displayDiv = document.getElementById('mirror-box');
            displayDiv.style.display = "block";

            const modules = ['algebra-workbook', 'geometry-proofs', 'calculus-limits', 'history-archive', 'chemistry-lab', 'literature-notes'];
            const randomSubject = modules[Math.floor(Math.random() * modules.length)] + '-' + Math.floor(1000 + Math.random() * 9000);
            
            // Constructs the clean alias path using your active platform location
            const generatedMirrorUrl = window.location.origin + '/?assignment=' + randomSubject;

            displayDiv.innerHTML = '📋 <strong>LIVE ASSIGNMENT ALIAS MIRROR LIVE:</strong><br><br><a href="' + generatedMirrorUrl + '" target="_blank" style="color:#0070f3; font-weight:bold; text-decoration:none;">' + generatedMirrorUrl + '</a><br><br><small style="color:#64748b;">*This link maps an alternative gateway path completely independent of your browser history.*</small>';
        };
    </script>
</body>
</html>
