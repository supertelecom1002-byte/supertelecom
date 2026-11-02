export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Super Telecom | Refresh to Update</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #020617; color: #f8fafc; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; background: #0f172a; border-radius: 1rem; border: 1px solid #1e293b; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
      h1 { font-size: 1.35rem; font-weight: 700; margin: 0 0 0.5rem; color: #38bdf8; }
      p { color: #94a3b8; font-size: 0.95rem; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.65rem 1.25rem; border-radius: 0.5rem; font: inherit; font-size: 0.875rem; font-weight: 600; cursor: pointer; text-decoration: none; border: 1px solid transparent; transition: all 0.2s ease; }
      .primary { background: linear-gradient(135deg, #0284c7, #06b6d4); color: #fff; border: none; }
      .primary:hover { opacity: 0.95; transform: scale(1.02); }
      .secondary { background: #1e293b; color: #f8fafc; border-color: #334155; }
      .secondary:hover { background: #334155; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Update Available / नया वर्शन उपलब्ध है</h1>
      <p>A fresh update has been deployed. Click below to refresh your browser cache and load the latest live version.</p>
      <div class="actions">
        <button class="primary" onclick="forceHardPurgeAndReload()">Refresh & Update / नया वर्शन लोड करें</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
    <script>
      function forceHardPurgeAndReload() {
        try {
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(regs) {
              regs.forEach(function(r) { r.unregister(); });
            });
          }
          if ('caches' in window) {
            caches.keys().then(function(keys) {
              Promise.all(keys.map(function(k) { return caches.delete(k); })).finally(function() {
                window.location.replace(window.location.origin + window.location.pathname + '?_fresh=' + Date.now());
              });
            });
            return;
          }
        } catch(e) {}
        window.location.replace(window.location.origin + window.location.pathname + '?_fresh=' + Date.now());
      }
    </script>
  </body>
</html>`;
}
