export {};

declare global {
  interface Window {
    /**
     * Desktop (Electron) bridge exposed via preload. Absent when running in a
     * plain browser, so guard with `typeof window.vibeVideo !== "undefined"`.
     */
    vibeVideo?: {
      platform: string;
      isDesktop: boolean;
      downloadVideo: () => Promise<string>;
      windowControls?: {
        minimize: () => void;
        toggleMaximize: () => void;
        close: () => void;
        isMaximized: () => Promise<boolean>;
        onMaximizedChange: (callback: (maximized: boolean) => void) => () => void;
      };
    };
  }
}
