declare global {
  interface Window {
    fbq: (
      command: 'init' | 'track' | 'trackSingle',
      eventName: string,
      params?: Record<string, any>
    ) => void;
  }
}

export {};

