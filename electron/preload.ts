import { contextBridge, ipcRenderer } from "electron";

// Expose a minimal, safe API surface to the renderer.
// Extend this as you add desktop-specific capabilities (file system,
// native dialogs, etc.) via ipcRenderer.invoke.
const api = {
  platform: process.platform,
  isDesktop: true,
  /**
   * Download the simulated "generated" video and resolve with its absolute
   * local file path (usable as a `src` for a <video> element).
   */
  downloadVideo: (): Promise<string> =>
    ipcRenderer.invoke("vibevideo:download-video"),

  /**
   * Window controls for the custom frameless title bar.
   */
  windowControls: {
    minimize: (): void => ipcRenderer.send("vibevideo:window-minimize"),
    toggleMaximize: (): void =>
      ipcRenderer.send("vibevideo:window-toggle-maximize"),
    close: (): void => ipcRenderer.send("vibevideo:window-close"),
    isMaximized: (): Promise<boolean> =>
      ipcRenderer.invoke("vibevideo:window-is-maximized"),
    /**
     * Subscribe to maximize-state changes (returns an unsubscribe function).
     */
    onMaximizedChange: (callback: (maximized: boolean) => void): (() => void) => {
      const listener = (_event: unknown, maximized: boolean) =>
        callback(maximized);
      ipcRenderer.on("vibevideo:maximized-changed", listener);
      return () =>
        ipcRenderer.removeListener("vibevideo:maximized-changed", listener);
    },
  },
};

contextBridge.exposeInMainWorld("vibeVideo", api);
