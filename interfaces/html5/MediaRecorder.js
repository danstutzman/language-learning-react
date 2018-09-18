declare class MediaRecorder {
  constructor(stream?: any): MediaRecorder;
  static isTypeSupported(type: string): boolean;
  addEventListener(eventName: string, (event: any) => void): void;
  start(timeslice?: number): void;
  stop(): void;
};
