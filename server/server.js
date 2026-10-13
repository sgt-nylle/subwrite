// Production Node.js Server for SubWrite!
// Serves static dist/ files and provides persistent /api/scores API

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.resolve(__dirname, '../dist');
const SCORES_FILE = path.resolve(__dirname, '../data/scores.json');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  // API endpoint: /api/scores
  if (req.url?.startsWith('/api/scores')) {
    res.setHeader('Content-Type', 'application/json');

    const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const levelParam = urlObj.searchParams.get('level');
    const deviceParam = urlObj.searchParams.get('device');

    if (req.method === 'GET') {
      try {
        if (!fs.existsSync(SCORES_FILE)) {
          fs.mkdirSync(path.dirname(SCORES_FILE), { recursive: true });
          fs.writeFileSync(SCORES_FILE, '[]', 'utf-8');
        }
        const data = fs.readFileSync(SCORES_FILE, 'utf-8');
        let scores = JSON.parse(data);
        if (deviceParam) {
          scores = scores.filter(s => (s.device || 'desktop') === deviceParam);
        }
        if (levelParam) {
          const targetLvl = parseInt(levelParam, 10);
          scores = scores.filter(s => Number(s.level) === targetLvl);
        }
        res.statusCode = 200;
        return res.end(JSON.stringify(scores));
      } catch (err) {
        console.error('Error reading scores:', err);
        res.statusCode = 500;
        return res.end(JSON.stringify({ error: 'Failed to read scores' }));
      }
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          const newEntry = JSON.parse(body);
          if (!newEntry.initials || typeof newEntry.score !== 'number') {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Invalid score payload' }));
          }

          let currentScores = [];
          if (fs.existsSync(SCORES_FILE)) {
            try {
              currentScores = JSON.parse(fs.readFileSync(SCORES_FILE, 'utf-8'));
            } catch {
              currentScores = [];
            }
          }

          const device = newEntry.device === 'mobile' ? 'mobile' : 'desktop';
          const formattedEntry = {
            id: Date.now().toString(),
            initials: String(newEntry.initials).toUpperCase().slice(0, 3).padEnd(3, 'X'),
            score: Math.round(newEntry.score),
            wpm: Math.round(newEntry.wpm || 0),
            accuracy: Math.round(newEntry.accuracy || 100),
            level: Number(newEntry.level || 1),
            device,
            failedChars: Math.max(0, Math.round(newEntry.failedChars ?? newEntry.incorrectChars ?? 0)),
            date: new Date().toISOString().split('T')[0]
          };

          currentScores.push(formattedEntry);
          currentScores.sort((a, b) => b.score - a.score);
          currentScores = currentScores.slice(0, 200);

          fs.mkdirSync(path.dirname(SCORES_FILE), { recursive: true });
          fs.writeFileSync(SCORES_FILE, JSON.stringify(currentScores, null, 2), 'utf-8');

          res.statusCode = 200;
          return res.end(JSON.stringify(currentScores));
        } catch (err) {
          console.error('Error saving score:', err);
          res.statusCode = 500;
          return res.end(JSON.stringify({ error: 'Failed to save score' }));
        }
      });
      return;
    }
  }

  // Static File Serving
  let safePath = path.normalize(decodeURI(req.url || '/')).replace(/^(\.\.[/\\])+/, '');
  if (safePath === '/' || safePath === '') {
    safePath = '/index.html';
  }

  let filePath = path.join(DIST_DIR, safePath);

  if (!fs.existsSync(filePath)) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      return res.end('Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`SubWrite! Server running at http://0.0.0.0:${PORT}/`);
});
