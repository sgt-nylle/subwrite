import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

const SCORES_FILE = path.resolve(process.cwd(), 'data/scores.json')

function scoresApiPlugin(): Plugin {
  return {
    name: 'scores-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/scores')) {
          return next();
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          return res.end();
        }

        if (req.method === 'GET') {
          try {
            if (!fs.existsSync(SCORES_FILE)) {
              fs.mkdirSync(path.dirname(SCORES_FILE), { recursive: true });
              fs.writeFileSync(SCORES_FILE, '[]', 'utf-8');
            }
            const data = fs.readFileSync(SCORES_FILE, 'utf-8');
            const scores = JSON.parse(data);
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

              const formattedEntry = {
                id: Date.now().toString(),
                initials: String(newEntry.initials).toUpperCase().slice(0, 3).padEnd(3, 'X'),
                score: Math.round(newEntry.score),
                wpm: Math.round(newEntry.wpm || 0),
                accuracy: Math.round(newEntry.accuracy || 100),
                level: Number(newEntry.level || 1),
                date: new Date().toISOString().split('T')[0]
              };

              currentScores.push(formattedEntry);
              currentScores.sort((a: { score: number }, b: { score: number }) => b.score - a.score);
              currentScores = currentScores.slice(0, 50); // Keep top 50

              fs.mkdirSync(path.dirname(SCORES_FILE), { recursive: true });
              fs.writeFileSync(SCORES_FILE, JSON.stringify(currentScores, null, 2), 'utf-8');

              res.statusCode = 200;
              return res.end(JSON.stringify(currentScores.slice(0, 10)));
            } catch (err) {
              console.error('Error saving score:', err);
              res.statusCode = 500;
              return res.end(JSON.stringify({ error: 'Failed to save score' }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), scoresApiPlugin()],
  server: {
    host: true,
    port: 5173
  }
})
