import path from 'path';
import { execFileSync } from 'child_process';
import { defineConfig, loadEnv } from 'vite';

const generateScriptPath = path.resolve(__dirname, 'scripts', 'generate-portfolio-data.mjs');

const runDataGenerator = () => {
  execFileSync(process.execPath, [generateScriptPath], { stdio: 'inherit' });
};

const watchedRoots = [
  path.resolve(__dirname, 'dataset'),
  path.resolve(__dirname, 'Project'),
  path.resolve(__dirname, 'Personal Info'),
  path.resolve(__dirname, 'Work Experience'),
  path.resolve(__dirname, 'Research Experience'),
  path.resolve(__dirname, 'Award'),
  path.resolve(__dirname, 'skills.json'),
];

const shouldRegenerate = (filePath: string): boolean => {
  const normalized = path.resolve(filePath);
  return watchedRoots.some(root => normalized.startsWith(root));
};

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/personal-page/',
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, 'index.html'),
            project: path.resolve(__dirname, 'project.html'),
            introduce: path.resolve(__dirname, 'introduce.html'),
            portfolio: path.resolve(__dirname, 'portfolio.html'),
          },
        },
      },
      plugins: [
        {
          name: 'portfolio-data-generator',
          buildStart() {
            runDataGenerator();
          },
          configureServer(server) {
            let debounceTimer: NodeJS.Timeout | null = null;

            const regenerateAndReload = (changedFile: string) => {
              if (!shouldRegenerate(changedFile)) return;

              if (debounceTimer) clearTimeout(debounceTimer);
              debounceTimer = setTimeout(() => {
                try {
                  runDataGenerator();
                  server.ws.send({ type: 'full-reload' });
                } catch (error) {
                  console.error('[portfolio-data-generator] regenerate failed:', error);
                }
              }, 120);
            };

            server.watcher.on('add', regenerateAndReload);
            server.watcher.on('change', regenerateAndReload);
            server.watcher.on('unlink', regenerateAndReload);
            server.watcher.on('addDir', regenerateAndReload);
            server.watcher.on('unlinkDir', regenerateAndReload);
          },
        },
      ],
    };
});
