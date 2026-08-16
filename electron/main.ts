import { app, BrowserWindow, shell, ipcMain } from "electron";
import * as path from "path";
import * as fs from "fs";
import * as http from "http";
import { pathToFileURL } from "url";

const isDev = process.env.NODE_ENV === "development";

/**
 * Resolve the static export directory (`out/`) relative to the compiled main
 * process. The build outputs `dist-electron/main.js`, so `out/` lives one
 * level up. Returns its absolute path so we can serve assets from disk.
 */
function getStaticDir(): string {
  return path.join(__dirname, "../out");
}

/**
 * Map a file extension to its MIME type so the renderer can correctly parse
 * scripts, styles, fonts, images and, most importantly, HTML documents.
 */
function mimeForExt(ext: string): string {
  switch (ext) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".js":
      return "text/javascript; charset=utf-8";
    case ".mjs":
      return "text/javascript; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".svg":
      return "image/svg+xml";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    case ".ico":
      return "image/x-icon";
    case ".woff":
      return "font/woff";
    case ".woff2":
      return "font/woff2";
    case ".ttf":
      return "font/ttf";
    case ".mp4":
      return "video/mp4";
    case ".webm":
      return "video/webm";
    case ".txt":
      return "text/plain; charset=utf-8";
    default:
      return "application/octet-stream";
  }
}

/**
 * Serve the Next.js static export over plain HTTP.
 *
 * The static export emits absolute asset URLs (`/_next/...`, `/images/...`).
 * Under a custom scheme or `file://` those resolve incorrectly and 404,
 * leaving the app unstyled and breaking hydration. Serving over a local HTTP
 * server keeps Next.js' runtime behaviour identical to a browser, which is
 * essential for hydration, client-side navigation and localStorage to work.
 *
 * Request types handled here:
 *  - Static assets under `/_next/`: served from disk with correct MIME types.
 *  - HTML navigation (e.g. `/`, `/generate/`): mapped to the directory's
 *    `index.html` so a full page load always resolves.
 *  - RSC flight requests (`?_rsc=...`): the static export does not emit any
 *    RSC payload, so we return 404 — this forces the Next.js router to fall
 *    back to a full document navigation instead of hanging on a broken fetch.
 */
function handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
  const staticDir = getStaticDir();
  const rawUrl = req.url || "/";
  const url = new URL(rawUrl, "http://127.0.0.1");

  // Strip the host; keep the pathname (e.g. "/_next/static/...").
  let pathname = decodeURIComponent(url.pathname);

  // RSC flight requests are never satisfiable from a static export; 404 so
  // the router degrades to a full page load.
  if (url.searchParams.has("_rsc")) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  // Treat any path without a file extension as a document navigation and map
  // it to the directory's index.html (with `trailingSlash: true` each route
  // is a folder containing an index.html).
  const hasExtension = /\.[^/]+$/.test(pathname);
  let resolved: string;
  if (!hasExtension) {
    const dir = pathname === "/" ? "" : pathname.replace(/\/$/, "");
    resolved = path.join(staticDir, dir, "index.html");
  } else {
    resolved = path.join(staticDir, pathname);
  }

  resolved = path.normalize(resolved);
  // Prevent path traversal outside the static directory.
  if (!resolved.startsWith(staticDir)) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  try {
    const buffer = fs.readFileSync(resolved);
    const mime = mimeForExt(path.extname(resolved));
    res.writeHead(200, { "Content-Type": mime });
    res.end(buffer);
  } catch {
    // Fall back to the 404 page for document navigations; otherwise a bare 404.
    try {
      const notFound = fs.readFileSync(path.join(staticDir, "404.html"));
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(notFound);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
    }
  }
}

/**
 * Create a local HTTP server bound to 127.0.0.1 on a random free port and
 * resolve with its base URL. Binding to loopback only keeps the server private
 * and avoids port conflicts via automatic assignment.
 */
function createStaticServer(): Promise<{ server: http.Server; url: string }> {
  return new Promise((resolve, reject) => {
    const server = http.createServer(handleRequest);
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      if (addr && typeof addr === "object") {
        resolve({ server, url: `http://127.0.0.1:${addr.port}/` });
      } else {
        reject(new Error("Failed to resolve static server address"));
      }
    });
  });
}

// Track the active static server so it can be closed on quit.
let staticServer: http.Server | null = null;

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 640,
    title: "VibeVideo",
    backgroundColor: "#0a0a0b",
    // Delay showing the window until the renderer has painted its first frame.
    // This prevents the white flash that otherwise appears while the local
    // static server is starting and the page is still loading.
    show: false,
    // Frameless window: the app draws its own custom title bar (matching the
    // project's design language) instead of the native Windows chrome. This
    // removes the default OS title bar that looks out of place with the UI.
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Show the window once the renderer has painted its first frame. Together
  // with `show: false` above, this eliminates the startup white flash.
  win.once("ready-to-show", () => {
    win.show();
  });

  // Window state used to reflect the maximize state to the renderer (so the
  // custom maximize/restore button can toggle its icon).
  const sendMaximizedState = () => {
    win.webContents.send("vibevideo:maximized-changed", win.isMaximized());
  };
  win.on("maximize", sendMaximizedState);
  win.on("unmaximize", sendMaximizedState);

  // Open external links in the system browser instead of new Electron windows.
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  // Forward renderer console messages to the main process stdout so runtime
  // JS errors (hydration failures, failed resource loads) are visible when
  // launched with logging enabled.
  win.webContents.on("console-message", (_event, level, message, line, sourceId) => {
    console.log(`[renderer:${level}] ${message} (${sourceId}:${line})`);
  });
  win.webContents.on("did-fail-load", (_event, code, desc, url) => {
    console.error(`[did-fail-load] ${code} ${desc} ${url}`);
  });

  if (isDev) {
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    // The static server is started before the window is created (see
    // app.whenReady), so its base URL is already known via a module-level
    // variable set in startStaticServer. Load the root path (not /index.html)
    // so Next.js `usePathname()` reports "/" instead of "/index.html".
    const baseUrl = getStaticBaseUrl();
    win.loadURL(baseUrl);
  }
}

// The base URL of the static server, set once the server is listening.
let staticBaseUrl = "";

function getStaticBaseUrl(): string {
  return staticBaseUrl;
}

app.whenReady().then(async () => {
  if (!isDev) {
    const { server, url } = await createStaticServer();
    staticServer = server;
    staticBaseUrl = url;
  }

  // IPC: return the local bundled sample video path (a soothing nature clip)
  // used to simulate a freshly "generated" result. The file ships with the app
  // under `public/videos/`, so no network access is required.
  // Window controls for the custom (frameless) title bar. The renderer sends
  // these to drive minimize/maximize/close from the app-drawn title bar.
  ipcMain.on("vibevideo:window-minimize", (event) => {
    BrowserWindow.fromWebContents(event.sender)?.minimize();
  });
  ipcMain.on("vibevideo:window-toggle-maximize", (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) return;
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });
  ipcMain.on("vibevideo:window-close", (event) => {
    BrowserWindow.fromWebContents(event.sender)?.close();
  });
  ipcMain.handle("vibevideo:window-is-maximized", (event) => {
    return BrowserWindow.fromWebContents(event.sender)?.isMaximized() ?? false;
  });

  ipcMain.handle("vibevideo:download-video", async () => {
    // In development the renderer is served from the Next.js dev server, so
    // return the public asset URL directly; in production serve from `out/`.
    if (isDev) {
      return "http://localhost:3000/videos/healing.mp4";
    }
    const videoPath = path.join(getStaticDir(), "videos", "healing.mp4");
    if (!fs.existsSync(videoPath)) {
      throw new Error(`Sample video not found: ${videoPath}`);
    }
    return pathToFileURL(videoPath).toString();
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (staticServer) {
    staticServer.close();
    staticServer = null;
  }
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (staticServer) {
    staticServer.close();
    staticServer = null;
  }
});
