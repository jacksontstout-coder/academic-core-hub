const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

const app = express();
app.use(cors(), express.static(__dirname));

app.get('/', (req, res) => {
    const active = req.query.assignment || '';
    const q = req.query.q || '';
    const banner = active ? `display:inline-block;` : `display:none;`;

    res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Student Workspace Portal</title><style>
        body,html{margin:0;padding:0;width:100%;height:100%;font-family:sans-serif;background:#f4f6f9;color:#1e293b;overflow:hidden;}
        .app-container{display:flex;min-height:100vh;}
        .sidebar{width:260px;background:#2c3e50;color:white;display:flex;flex-direction:column;padding:20px;box-sizing:border-box;}
        .school-logo{font-size:18px;font-weight:800;padding-bottom:25px;border-bottom:1px solid rgba(255,255,255,0.1);margin-bottom:20px;}
        .nav-item{padding:12px 15px;border-radius:6px;margin-bottom:8px;font-size:14px;color:rgba(255,255,255,0.8);}
        .nav-item.active{background:#34495e;color:white;}
        .main-content{flex:1;padding:40px;box-sizing:border-box;overflow-y:auto;display:flex;flex-direction:column;gap:30px;}
        .header-card{background:white;border:1px solid #e2e8f0;border-radius:12px;padding:25px;position:relative;}
        .header-card::before{content:'';position:absolute;top:0;left:0;width:4px;height:100%;background:#0070f3;}
        .status-badge{display:${active?'inline-block':'none'};padding:4px 12px;font-size:12px;font-weight:700;border-radius:20px;background:#dcfce7;color:#15803d;margin-bottom:12px;text-transform:uppercase;}
        .tool-box{background:white;border:1px solid #e2e8f0;border-radius:12px;padding:30px;}
        input{width:100%;padding:14px 16px;font-size:15px;border:1px solid #e2e8f0;border-radius:8px;box-sizing:border-box;margin-bottom:20px;outline:none;background:#f8fafc;}
        button{display:block;padding:14px 24px;font-size:15px;background:#0070f3;color:white;border:none;border-radius:8px;cursor:pointer;width:100%;font-weight:600;}
        .bot-btn{background:#1e293b;margin-top:10px;}
        .view-panel{display:${q?'block':'none'};width:100%;height:100%;position:fixed;top:0;left:0;z-index:1000;background:#fff;}
        iframe{width:100%;height:100%;border:none;}
        #result-link{margin-top:25px;padding:15px;background:#f0f7ff;border:1px solid #bae7ff;border-radius:8px;display:none;word-break:break-all;}
    </style><script src="/uv.config.js"></script></head><body>
        <div class="view-panel"><iframe src="${q?'/service/'+encodeURIComponent(decodeURIComponent(q)):''}" sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts"></iframe></div>
        <div class="app-container"><div class="sidebar"><div class="school-logo">CampusWorkspace</div><div class="nav-item active">Assignment Core</div><div class="nav-item">Course Modules</div></div>
        <div class="main-content"><div class="header-card"><div class="status-badge">Active Session: ${active.toUpperCase()}</div><h2>Research Module: ${active.replace(/-/g,' ').toUpperCase() || 'General Gateway'}</h2></div>
        <div class="tool-box"><h3>External Research Engine Tunnel</h3><input type="text" id="urlInput" placeholder="Enter target site..."><button id="searchBtn">Execute Research Pipeline</button></div>
        <div class="tool-box"><h3>Proxy Dispenser Bot</h3><button class="bot-btn" id="cloneBtn">Replicate Workspace Node</button><div id="result-link"></div></div></div></div>
        <script>
            if('serviceWorker' in navigator){navigator.serviceWorker.register('/uv.sw.js',{scope:__uv$config.prefix});}
            document.getElementById('searchBtn').onclick=function(){
                let t=document.getElementById('urlInput').value.trim(); if(!t)return;
                if(!t.includes('.')){t='https://google.com;}else if(!/^https?:\\/\\//i.test(t)){t='https://'+t;}
                const s=['algebra-workbook','geometry-proofs','calculus-limits','history-archive'];
                window.location.href='/?assignment='+s[Math.floor(Math.random()*s.length)]+'-'+Math.floor(1000+Math.random()*9000)+'&q='+encodeURIComponent(t);
            };
            document.getElementById('cloneBtn').onclick=function(){
                const div=document.getElementById('result-link'); div.style.display="block";
                const s=['algebra-workbook','geometry-proofs','calculus-limits'];
                const n=window.location.origin+'/?assignment='+s[Math.floor(Math.random()*s.length)]+'-'+Math.floor(1000+Math.random()*9000);
                div.innerHTML='<strong>Generated Node Link:</strong><br><br><a href="'+n+'" target="_self" style="color:#0070f3;text-decoration:none;">'+n+'</a>';
            };
        </script>
    </body></html>`);
});

app.get('/service/*', async (req, res) => {
    let t = decodeURIComponent(req.params[0]); if(!t) return res.status(400).send("No URL specified.");
    try {
        const u = new URL(t);
        const resData = await fetch(t, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        let contentType = resData.headers.get('content-type') || '';
        if(!contentType.includes('text/html')){ return res.send(await resData.buffer()); }
        let html = await resData.text();
        html = html.replace(/<head>/i, `<head><base href="${u.origin}/"><script>(function(){Object.defineProperty(window,'top',{value:window});Object.defineProperty(window,'parent',{value:window});})();<\/script>`);
        res.setHeader('Content-Type','text/html;charset=utf-8');
        res.send(html.replace(/content-security-policy/gi,'disabled-csp').replace(/x-frame-options/gi,'disabled-xfo'));
    } catch(err) { res.status(500).send(`Error: ${err.message}`); }
});

app.listen(process.env.PORT || 3000);
