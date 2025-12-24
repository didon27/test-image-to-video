declare module 'ffmpeg-kit-react-native' {
  export class FFmpegKit {
    static execute(command: string): Promise<FFmpegSession>;
    static executeWithArguments(commandArguments: string[]): Promise<FFmpegSession>;
    static cancel(sessionId?: number): Promise<void>;
    static listSessions(): Promise<FFmpegSession[]>;
  }

  export class FFmpegKitConfig {
    static enableStatisticsCallback(statisticsCallback: StatisticsCallback): void;
    static enableLogCallback(logCallback: LogCallback): void;
    static getFFmpegVersion(): Promise<string>;
    static setLogLevel(level: Level): Promise<void>;
  }

  export class ReturnCode {
    static readonly SUCCESS: number;
    static readonly CANCEL: number;
    static isSuccess(returnCode: ReturnCode): boolean;
    static isCancel(returnCode: ReturnCode): boolean;
    getValue(): number;
    isValueSuccess(): boolean;
    isValueError(): boolean;
    isValueCancel(): boolean;
  }

  export interface FFmpegSession {
    getSessionId(): number;
    getCommand(): string;
    getReturnCode(): Promise<ReturnCode>;
    getAllLogsAsString(waitTimeout?: number): Promise<string>;
    getOutput(): Promise<string>;
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

  export type StatisticsCallback = (statistics: Statistics) => void;
  export type LogCallback = (log: Log) => void;

  export class Log {
    getSessionId(): number;
    getLevel(): number;
    getMessage(): string;
  }

  export class Level {
    static readonly AV_LOG_STDERR: number;
    static readonly AV_LOG_QUIET: number;
    static readonly AV_LOG_PANIC: number;
    static readonly AV_LOG_FATAL: number;
    static readonly AV_LOG_ERROR: number;
    static readonly AV_LOG_WARNING: number;
    static readonly AV_LOG_INFO: number;
    static readonly AV_LOG_VERBOSE: number;
    static readonly AV_LOG_DEBUG: number;
    static readonly AV_LOG_TRACE: number;
  }
}
