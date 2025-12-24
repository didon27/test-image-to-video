declare module 'ffmpeg-kit-react-native-alt' {
  export class FFmpegKit {
    static execute(command: string): Promise<FFmpegSession>;
    static executeWithArguments(commandArguments: string[]): Promise<FFmpegSession>;
    static executeAsync(
      command: string,
      completeCallback?: (session: FFmpegSession) => void,
      logCallback?: (log: Log) => void,
      statisticsCallback?: (statistics: Statistics) => void
    ): Promise<FFmpegSession>;
    static cancel(sessionId?: number): Promise<void>;
    static listSessions(): Promise<FFmpegSession[]>;
  }

  export class FFmpegKitConfig {
    static init(): Promise<void>;
    static enableStatisticsCallback(callback: (statistics: Statistics) => void): void;
    static enableLogCallback(callback: (log: Log) => void): void;
    static setLogLevel(level: number): Promise<void>;
    static getFFmpegVersion(): Promise<string>;
    static getVersion(): Promise<string>;
  }

  export class ReturnCode {
    static readonly SUCCESS: number;
    static readonly CANCEL: number;
    static isSuccess(returnCode: ReturnCode | null): boolean;
    static isCancel(returnCode: ReturnCode | null): boolean;
    getValue(): number;
    isValueSuccess(): boolean;
    isValueError(): boolean;
    isValueCancel(): boolean;
  }

  export interface FFmpegSession {
    getSessionId(): number;
    getReturnCode(): Promise<ReturnCode>;
    getAllLogsAsString(waitTimeout?: number): Promise<string>;
    getLogsAsString(): Promise<string>;
    getOutput(): Promise<string>;
    getDuration(): Promise<number>;
    getState(): Promise<SessionState>;
    cancel(): Promise<void>;
  }

  export class Statistics {
    getSessionId(): number;
    getVideoFrameNumber(): number;
    getVideoFps(): number;
    getVideoQuality(): number;
    getSize(): number;
    getTime(): number;
    getBitrate(): number;
    getSpeed(): number;
  }

  export class Log {
    getSessionId(): number;
    getLevel(): number;
    getMessage(): string;
  }

  export enum SessionState {
    CREATED = 0,
    RUNNING = 1,
    FAILED = 2,
    COMPLETED = 3,
  }
}
